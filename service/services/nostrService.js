const WebSocket = require('ws');
const nip19 = require('nostr-tools/nip19');
const { SimplePool } = require('nostr-tools/pool');
const { useWebSocketImplementation } = require('nostr-tools/pool');
const { getPublicKey } = require('nostr-tools');
const { createNip04Dm, createNip17Dm } = require('../utils/nostrUtils');

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

    async performNip04DM(recipientPubkey, content) {
        try {
            return await createNip04Dm(
                this.senderPrivateKey,
                recipientPubkey,
                content
            );

        } catch (error) {
            console.error('Error creating encrypted DM:', error);
            throw error;
        }
    }

    async performNip17DM(recipientPubkey, content) {
        try {
            return await createNip17Dm(
                this.senderPrivateKey,
                recipientPubkey,
                content
            );

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

    async publishReceiptEvent(details) {
        try {
            const { npub, receipt, relay } = details;
            const recipientPubkey = nip19.decode(npub).data;

            let event;
            let eventIds = [];
            let publishedEvents = [];
            const publishPromises = [];

            if (relay.protocol === 'NIP-04') {
                event = await this.dmService.performNip04DM(
                    recipientPubkey,
                    receipt,
                );
                this.relayPool.publish([relay.url], event);
                eventIds.push(event.id);
            }

            else if (relay.protocol === 'NIP-17') {
                event = await this.dmService.performNip17DM(
                    recipientPubkey,
                    receipt
                );

                eventIds.push(event.receiverGiftWrap.id, event.senderGiftWrap.id);

                publishPromises.push(
                    this.relayPool.publish([relay.url], event.receiverGiftWrap),
                    this.relayPool.publish([relay.url], event.senderGiftWrap)
                );
            }

            console.log("Event: ", event)

            await Promise.all(publishPromises);

            await new Promise(resolve => setTimeout(resolve, 1000));

            publishedEvents = await this.relayPool.querySync(
                [relay.url],
                { ids: eventIds }
            )

            console.log('Published events:', publishedEvents.length);

            if (relay.protocol === 'NIP-04' && publishedEvents.length === 1) return true;
            if (relay.protocol === 'NIP-17' && publishedEvents.length === 2) return true;
            return false;
        } catch (error) {
            console.error('Error publishing to relays:', error);
            throw error;
        }
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
