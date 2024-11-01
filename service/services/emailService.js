const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');
const { ProtonMailProvider } = require('./email/emailProviders');
const { invoiceTemplate, shippingTemplate } = require('./email/templates');
const EmailTransport = require('./email/emailTransport');
const EmailClient = require('./email/emailClient');

class EmailService {
    constructor() {
        this.clients = new Map();
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        try {
            const configs = this.loadEmailConfigs();
            this.validateConfigs(configs);

            for (const [key, config] of Object.entries(configs)) {
                this.initializeClient(key, config);
            }
        } catch (error) {
            console.error('Failed to initialize EmailService:', error);
            // Consider implementing a retry mechanism or fallback here
            throw new Error('EmailService initialization failed');
        }
    }

    validateConfigs(configs) {
        for (const [key, config] of Object.entries(configs)) {
            if (!config.address || !config.token) {
                throw new Error(`Invalid configuration for ${key}: Missing required fields`);
            }
        }
    }

    initializeClient(key, config) {
        try {
            const transport = new EmailTransport(
                ProtonMailProvider.createTransportConfig({
                    username: config.address,
                    token: config.token
                })
            );

            transport.on('error', (error) => {
                console.error(`Transport error for ${key}:`, error);
                // Implement retry logic or failover mechanism?
                this.handleTransportError(key, error);
            });

            const client = new EmailClient(transport, config);
            this.clients.set(key, client);
        } catch (error) {
            console.error(`Failed to initialize client for ${key}:`, error);
            throw error;
        }
    }

    handleTransportError(clientKey, error) {
        // Implement retry logic, circuit breaker, or failover?
        // For now, we'll just log the error
        console.error(`Email transport error for ${clientKey}:`, error);
    }

    loadEmailConfigs() {
        const requiredEnvVars = [
            'SHIPPING_EMAIL',
            'SHIPPING_TOKEN',
            'RECEIPTS_EMAIL',
            'RECEIPTS_TOKEN'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        return {
            shipping: {
                address: process.env.SHIPPING_EMAIL,
                token: process.env.SHIPPING_TOKEN,
            },
            receipts: {
                address: process.env.RECEIPTS_EMAIL,
                token: process.env.RECEIPTS_TOKEN,
            }
        };
    }

    setupEventListeners() {
        eventBus.subscribe(InvoiceEvents.RECEIPT_CREATED, this.handleReceiptCreated.bind(this));
    }

    async handleReceiptCreated(details) {
        if (!details || !details.email) {
            console.warn('Received invalid receipt details:', details);
            return;
        }

        try {
            await this.sendInvoicePaidEmail(details);
        } catch (error) {
            console.error('Failed to process invoice emails:', error);
            // Consider implementing retry logic here?
            throw new Error('Failed to send invoice email: ' + error.message);
        }
    }

    async sendInvoicePaidEmail(details) {
        const receiptClient = this.clients.get('receipts');
        if (!receiptClient) {
            throw new Error('Receipt email client not configured');
        }

        try {
            await receiptClient.sendMail(
                details.email,
                invoiceTemplate.subject(),
                invoiceTemplate.body(details)
            );
        } catch (error) {
            console.error('Failed to send invoice email:', error);
            throw error;
        }
    }

    async sendShipmentUpdateEmail(shipment) {
        if (!shipment) {
            throw new Error('Shipment details are required');
        }

        const shippingClient = this.clients.get('shipping');
        if (!shippingClient) {
            throw new Error('Shipping email client not configured');
        }

        try {
            await shippingClient.sendMail(
                process.env.SHIPPING_DESTINATION,
                shippingTemplate.subject(shipment),
                shippingTemplate.body(shipment)
            );
        } catch (error) {
            console.error('Failed to send shipment update email:', error);
            throw error;
        }
    }
}

const emailService = Object.freeze(new EmailService());
module.exports = emailService;
