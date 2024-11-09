const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { getPublicKey, finalizeEvent, getEventHash, nip19, getSharedSecret, encrypt } = require('nostr-tools');
const { RelayPool } = require('nostr-tools/relay');
const { dbService } = require('./dbService');
const prisma = dbService.getPrismaClient();

class NostrService {
    constructor() {
        this.relayPools = new Map(); // npub -> RelayPool instance
        this.privateKey = null;
        this.publicKey = null;
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        try {
            this.validateConfig();
            this.initializeKeys();
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

    async getOrCreateRelayPool(npub) {
        const existingPool = this.relayPools.get(npub);
        if (existingPool) {
            console.log(`Using existing relay pool for npub: ${npub}`);
            return existingPool;
        }

        try {
            const relayPoolData = await prisma.relayPool.findUnique({
                where: { npub }
            });

            if (!relayPoolData) {
                console.error(`No relay pool found for npub: ${npub}`);
                throw new Error('No relay pool found for npub');
            }

            const pool = new RelayPool(relayPoolData.relays);

            pool.on('connect', (relay) => {
                console.log(`Connected to relay: ${relay.url} for npub: ${npub}`);
            });

            pool.on('error', (relay, error) => {
                console.error(`Error with relay ${relay.url} for npub: ${npub}:`, error);
                this.handleRelayError(npub, relay, error);
            });

            // Store for reuse
            this.relayPools.set(npub, pool);
            console.log(`Created new relay pool for npub: ${npub}`);

            return pool;
        } catch (error) {
            console.error('Error getting/creating relay pool:', error);
            throw error;
        }
    }

    handleRelayError(npub, relay, error) {
        // TODO: Implement relay error handling strategy
        // - Remove failed relay from pool?
        // - Try reconnecting?
        // - Notify monitoring system?
        console.error(`Relay error for ${npub} at ${relay.url}:`, error);
    }

    setupEventListeners() {
        eventBus.subscribe(InvoiceEvents.RECEIPT_CREATED, this.handleReceiptCreated.bind(this));
    }

    async handleReceiptCreated(details) {
        if (!details || !details.npub) {
            console.log('No npub provided in receipt details, skipping Nostr notification');
            return;
        }

        try {
            await this.publishReceiptEvent(details);
        } catch (error) {
            console.error('Failed to publish Nostr receipt:', error);
            // Consider implementing retry logic here
            throw new Error('Failed to publish Nostr receipt: ' + error.message);
        }
    }

    createReceiptEvent(details) {
        const recipientPubkey = nip19.decode(details.npub).data;
        const sharedSecret = getSharedSecret(this.privateKey, recipientPubkey);
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

        const event = {
            kind: 24, // NIP-17 Replaceable Private Direct Message
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['p', recipientPubkey],
                ['d', 'receipt'], // d tag for making it replaceable
            ],
            content: encrypt(content, sharedSecret),
            pubkey: this.publicKey
        };

        // Sign the event
        event.id = getEventHash(event);
        event.sig = finalizeEvent(event, this.privateKey);

        return event;
    }

    async publishReceiptEvent(details) {
        try {
            const pool = await this.getOrCreateRelayPool(details.npub);
            const event = this.createReceiptEvent(details);

            const published = await pool.publish(event);

            if (!published) {
                throw new Error('Failed to publish event to any relay');
            }

            console.log('Receipt published to Nostr network:', event.id);
            return event.id;
        } catch (error) {
            console.error('Error publishing to relays:', error);
            throw error;
        }
    }

    async cleanup() {
        console.log('Cleaning up NostrService...');

        for (const [npub, pool] of this.relayPools.entries()) {
            try {
                await pool.close();
                console.log(`Closed relay pool for npub: ${npub}`);
            } catch (error) {
                console.error(`Error closing relay pool for npub: ${npub}:`, error);
            }
        }

        this.relayPools.clear();
        console.log('NostrService cleanup completed');
    }

    async getPoolStatus(npub) {
        const pool = this.relayPools.get(npub);
        if (!pool) {
            return { status: 'not_found' };
        }

        const connectedRelays = pool.getConnectedRelays();
        return {
            status: 'active',
            connectedRelayCount: connectedRelays.length,
            totalRelayCount: pool.getRelayUrls().length,
            connectedRelays: connectedRelays.map(relay => relay.url)
        };
    }
}

const nostrService = Object.freeze(new NostrService());
module.exports = nostrService;
