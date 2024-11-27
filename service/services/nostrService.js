const WebSocket = require('ws');
const nip19 = require('nostr-tools/nip19');
const { SimplePool } = require('nostr-tools/pool');
const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { useWebSocketImplementation } = require('nostr-tools/pool');
const { getPublicKey } = require('nostr-tools');
const { createNip04Dm, createNip17Dm } = require('../utils/nostrUtils');
const { dbService } = require('./dbService');
const { invoiceTemplate } = require('./email/templates');
const prisma = dbService.getPrismaClient();

const DEFAULT_RELAYS = [
    {
        url: 'wss://relay.primal.net',
        protocol: 'NIP-04'
    }
];

useWebSocketImplementation(WebSocket);

class NostrDMService {
    constructor(senderPrivateKey) {
        this.senderPrivateKey = senderPrivateKey;
        this.senderPublicKey = getPublicKey(senderPrivateKey);
    }

    async createEncryptedDM(recipientPubkey, content, protocol = 'NIP-04') {
        try {
            if (protocol === 'NIP-17') {
                return await createNip17Dm(
                    this.senderPrivateKey,
                    recipientPubkey,
                    content
                );
            } else {
                return await createNip04Dm(
                    this.senderPrivateKey,
                    recipientPubkey,
                    content
                );
            }
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

    async getRelaysForNpub(npub) {
        try {
            const relayPool = await prisma.relayPool.findUnique({
                where: { npub },
                include: {
                    relays: true
                }
            });

            return relayPool?.relays || DEFAULT_RELAYS;
        } catch (error) {
            console.error('Error fetching relays:', error);
            return DEFAULT_RELAYS;
        }
    }

    async handleReceiptCreated(invoiceId, details) {
        if (!details || !details.npub) {
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

    async publishReceiptEvent(details) {
        try {
            const relays = await this.getRelaysForNpub(details.npub);
            const dmEvents = await this.createReceiptEvent(details);

            // Group relays by protocol
            const relaysByProtocol = relays.reduce((acc, relay) => {
                if (!acc[relay.protocol]) acc[relay.protocol] = [];
                acc[relay.protocol].push(relay.url);
                return acc;
            }, {});

            const publishPromises = [];

            // Publish to each relay with appropriate message format
            for (const [protocol, urls] of Object.entries(relaysByProtocol)) {
                if (protocol === 'NIP-17') {
                    publishPromises.push(
                        this.relayPool.publish(urls, dmEvents[protocol].receiverGiftWrap),
                        this.relayPool.publish(urls, dmEvents[protocol].senderGiftWrap)
                    );
                } else {
                    publishPromises.push(
                        this.relayPool.publish(urls, dmEvents[protocol].event),
                    );
                }

                // Wait for at least one successful publish
                await Promise.any(publishPromises);

                // Wait 5 seconds to allow for network propagation
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Verify the events were published
                let ids = [];

                if (protocol === 'NIP-17') {
                    ids = [dmEvents[protocol].receiverGiftWrap.id, dmEvents[protocol].senderGiftWrap.id];
                }
                else {
                    ids = [dmEvents[protocol].event.id];
                }

               this.relayPool.querySync(
                    relays.map(r => r.url),
                    { ids }
                );
            }

        } catch (error) {
            console.error('Error publishing to relays:', error);
            throw error;
        }
    }

    async createReceiptEvent(details) {
        const recipientPubkey = nip19.decode(details.npub).data;
        const content = invoiceTemplate.body(details);

        const relays = await this.getRelaysForNpub(details.npub);

        // Group events by protocol
        const events = {};
        for (const relay of relays) {
            if (!events[relay.protocol]) {
                events[relay.protocol] = await this.dmService.createEncryptedDM(
                    recipientPubkey,
                    content,
                    relay.protocol
                );
            }
        }

        return events;
    }

    async cleanup() {
        if (this.relayPool) {
            this.relayPool.close();
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
