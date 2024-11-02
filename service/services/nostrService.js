const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { generatePrivateKey, getPublicKey, finalizeEvent, getEventHash, nip19 } = require('nostr-tools');
const { RelayPool } = require('nostr-tools/relay');

class NostrService {
    constructor() {
        this.relayPool = null;
        this.privateKey = null;
        this.publicKey = null;
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        try {
            this.validateConfig();
            this.initializeKeys();
            this.initializeRelayPool();
        } catch (error) {
            console.error('Failed to initialize NostrService:', error);
            throw new Error('NostrService initialization failed');
        }
    }

    validateConfig() {
        const requiredEnvVars = [
            'NOSTR_PRIVATE_KEY',
            'NOSTR_RELAYS'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
    }

    initializeKeys() {
        try {
            this.privateKey = process.env.NOSTR_RECEIPTS_NSEC;
            this.publicKey = getPublicKey(this.privateKey);
        } catch (error) {
            console.error('Failed to initialize Nostr keys:', error);
            throw error;
        }
    }

    initializeRelayPool() {
        try {
            const relays = process.env.NOSTR_RELAYS.split(',');
            this.relayPool = new RelayPool(relays);

            this.relayPool.on('connect', (relay) => {
                console.log(`Connected to relay: ${relay.url}`);
            });

            this.relayPool.on('error', (relay, error) => {
                console.error(`Error with relay ${relay.url}:`, error);
            });
        } catch (error) {
            console.error('Failed to initialize relay pool:', error);
            throw error;
        }
    }

    setupEventListeners() {
        eventBus.subscribe(InvoiceEvents.RECEIPT_CREATED, this.handleReceiptCreated.bind(this));
    }

    async handleReceiptCreated(details) {
        if (!details || !details.npub) return;

        try {
            await this.publishReceiptEvent(details);
        } catch (error) {
            console.error('Failed to publish Nostr receipt:', error);
            // Consider implementing retry logic here
            throw new Error('Failed to publish Nostr receipt: ' + error.message);
        }
    }

    createReceiptEvent(details) {
        const event = {
            kind: 1, // Regular text note
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['p', nip19.decode(details.npub).data], // Tag the recipient's pubkey
                ['t', 'receipt'], // Tag for receipt type
                ['amount', details.amount.toString()],
                ['currency', details.currency],
                ['invoice_id', details.invoiceId]
            ],
            content: JSON.stringify({
                type: 'receipt',
                merchantName: process.env.MERCHANT_NAME,
                timestamp: new Date().toISOString(),
                details: {
                    amount: details.amount,
                    currency: details.currency,
                    items: details.items,
                    invoiceId: details.invoiceId
                }
            }),
            pubkey: this.publicKey
        };

        // Sign the event
        event.id = getEventHash(event);
        event.sig = finalizeEvent(event, this.privateKey);

        return event;
    }

    async publishReceiptEvent(details) {
        if (!this.relayPool) {
            throw new Error('Relay pool not initialized');
        }

        const event = this.createReceiptEvent(details);

        try {
            const published = await this.relayPool.publish(event);
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

    cleanup() {
        if (this.relayPool) {
            this.relayPool.close();
        }
    }
}

const nostrService = Object.freeze(new NostrService());
module.exports = nostrService;
