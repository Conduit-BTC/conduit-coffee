const WebSocket = require('ws');
const nip19 = require('nostr-tools/nip19');
const { SimplePool } = require('nostr-tools/pool');
const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { useWebSocketImplementation } = require('nostr-tools/pool');
const {
    getPublicKey,
    generateSecretKey,
    finalizeEvent,
    nip04
} = require('nostr-tools');
const { dbService } = require('./dbService');
const prisma = dbService.getPrismaClient();

const DEFAULT_RELAYS = [
    // 'ws://localhost:8008',
    // 'wss://relay.primal.net'
    'wss://relay.damus.io'
];

useWebSocketImplementation(WebSocket);

class NostrDMService {
    constructor(senderPrivateKey) {
        this.senderPrivateKey = senderPrivateKey;
        this.senderPublicKey = getPublicKey(senderPrivateKey);
    }

    createRumor(receiverPubkey, content, subject = null) {
        const rumor = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: content,
            pubkey: this.senderPublicKey
        };

        if (subject) {
            kind14.tags.push(["subject", subject]);
        }

        return rumor;
    }

    async createSeal(kind14, receiverPubkey) {
        const twoDaysAgo = Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60);
        const randomPastTime = twoDaysAgo + Math.floor(Math.random() * (2 * 24 * 60 * 60));

        // Encrypt the content using nip04
        const encryptedContent = await nip04.encrypt(
            this.senderPrivateKey,
            receiverPubkey,
            JSON.stringify(kind14)
        );

        const unsignedSeal = {
            kind: 13,
            created_at: randomPastTime,
            tags: [],
            content: encryptedContent,
            pubkey: this.senderPublicKey
        };

        // Sign the seal using finalizeEvent
        return finalizeEvent(unsignedSeal, this.senderPrivateKey);
    }

    async createGiftWrap(seal, receiverPubkey) {
        const wrapperPrivateKey = generateSecretKey();
        const wrapperPublicKey = getPublicKey(wrapperPrivateKey);

        const twoDaysAgo = Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60);
        const randomPastTime = twoDaysAgo + Math.floor(Math.random() * (2 * 24 * 60 * 60));

        // Encrypt the seal using nip04
        const encryptedSeal = await nip04.encrypt(
            wrapperPrivateKey,
            receiverPubkey,
            JSON.stringify(seal)
        );

        const unsignedGiftWrap = {
            kind: 1059,
            created_at: randomPastTime,
            tags: [
                ["p", receiverPubkey]
            ],
            content: encryptedSeal,
            pubkey: wrapperPublicKey
        };

        // Sign the gift wrap using finalizeEvent
        return finalizeEvent(unsignedGiftWrap, wrapperPrivateKey);
    }

    async createEncryptedDM(receiverPubkey, content, subject = null) {
        try {
            const kind14 = this.createRumor(receiverPubkey, content, subject);
            const seal = await this.createSeal(kind14, receiverPubkey);

            const receiverGiftWrap = await this.createGiftWrap(seal, receiverPubkey);
            const senderGiftWrap = await this.createGiftWrap(seal, this.senderPublicKey);

            return {
                receiverGiftWrap,
                senderGiftWrap
            };
        } catch (error) {
            console.error('Error creating encrypted DM:', error);
            throw error;
        }
    }
}

class NostrService {
    constructor() {
        this.relayPool = new SimplePool();
        this.privateKey = null;
        this.publicKey = null;
        this.dmService = null;
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        try {
            this.validateConfig();
            this.initializeKeys();
            this.dmService = new NostrDMService(this.privateKey);
            console.log('NostrService initialized successfully');
        } catch (error) {
            console.error('Failed to initialize NostrService:', error);
            throw new Error('NostrService initialization failed: ' + error.message);
        }
    }

    validateConfig() {
        const requiredEnvVars = ['NOSTR_NOTIFICATION_BOT_PRIVATE_KEY'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
    }

    initializeKeys() {
        try {
            this.privateKey = process.env.NOSTR_NOTIFICATION_BOT_PRIVATE_KEY;
            this.publicKey = getPublicKey(this.privateKey);
        } catch (error) {
            console.error('Failed to initialize Nostr keys:', error);
            throw error;
        }
    }

    setupEventListeners() {
        eventBus.subscribe(InvoiceEvents.RECEIPT_CREATED, this.handleReceiptCreated.bind(this));
    }

    async handleReceiptCreated(invoiceId, details) {
        if (!details || !details.npub) {
            console.log('No npub provided in receipt details, skipping Nostr notification');
            return;
        }

        try {
            await this.publishReceiptEvent({
                ...details,
                invoiceId
            });
        } catch (error) {
            console.error('Failed to publish Nostr receipt:', error);
        }
    }

    async getRelaysForNpub(npub) {
        try {
            return DEFAULT_RELAYS;
        } catch (error) {
            console.error('Error fetching relays:', error);
            return DEFAULT_RELAYS;
        }
    }

    async createReceiptEvent(details) {
        const recipientPubkey = nip19.decode(details.npub).data;
        const content = JSON.stringify({
            type: 'receipt',
            merchantName: process.env.MERCHANT_NAME,
            timestamp: new Date().toISOString(),
            details: {
                amount: details.amount,
                currency: details.currency,
                items: details.items,
                invoiceId: details.invoiceId,
                orderId: details.orderId
            }
        });

        return await this.dmService.createEncryptedDM(recipientPubkey, content);
    }

    async publishReceiptEvent(details) {
        try {
            const relays = await this.getRelaysForNpub(details.npub);
            const { receiverGiftWrap, senderGiftWrap } = await this.createReceiptEvent(details);

            // Publish to receiver's relays
            const receiverPublishPromise = this.relayPool.publish(relays, receiverGiftWrap);

            // Publish to sender's relays
            const senderPublishPromise = this.relayPool.publish(relays, senderGiftWrap);

            // Wait for at least one successful publish for each recipient
            await Promise.any([receiverPublishPromise, senderPublishPromise]);

            console.log('Receipt published to Nostr network:', {
                receiverId: receiverGiftWrap.id,
                receiverHex: receiverGiftWrap.tags[0][1],
                senderId: senderGiftWrap.id
            });

            // Verify the events were published
            const events = await this.relayPool.querySync(relays, {
                ids: [receiverGiftWrap.id, senderGiftWrap.id]
            });

            if (events.length > 0) {
                console.log('Receipt events verified on network');
            }

            return {
                receiverId: receiverGiftWrap.id,
                senderId: senderGiftWrap.id
            };
        } catch (error) {
            console.error('Error publishing to relays:', error);
            throw error;
        }
    }

    async cleanup() {
        if (this.relayPool) {
            await this.relayPool.close();
        }
    }

    async getStatus() {
        return {
            initialized: Boolean(this.relayPool && this.publicKey && this.dmService),
            publicKey: this.publicKey,
            defaultRelays: DEFAULT_RELAYS
        };
    }
}

const nostrService = Object.freeze(new NostrService());
module.exports = { nostrService };
