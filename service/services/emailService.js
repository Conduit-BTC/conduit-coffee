const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');
const { ProtonMailProvider } = require('./email/emailProviders');
const { invoiceTemplate, shippingTemplate } = require('./email/templates');
const EmailTransport = require('./email/EmailTransport');
const EmailClient = require('./email/EmailClient');

class EmailService {
    constructor() {
        this.clients = new Map();
        this.initialize();
        this.setupEventListeners();
    }

    initialize() {
        const configs = this.loadEmailConfigs();

        for (const [key, config] of Object.entries(configs)) {
            const transport = new EmailTransport(
                ProtonMailProvider.createTransportConfig(config)
            );

            const client = new EmailClient(transport, config);
            this.clients.set(key, client);

            transport.on('error', (error) => {
                console.error(`Transport error for ${key}:`, error);
            });
        }
    }

    loadEmailConfigs() {
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
        try {
            if (details.email) await this.sendInvoicePaidEmail(details);
        } catch (error) {
            console.error('Failed to process invoice emails:', error);
            throw error;
        }
    }

    async sendInvoicePaidEmail(details) {
        console.log("---Receipt Email---")
        console.log(invoiceTemplate.subject())
        console.log(invoiceTemplate.body(details))

        // const tasks = [];

        // const receiptClient = this.clients.get('receipts');
        // if (receiptClient) {
        //     const task = receiptClient.sendMail(
        //         process.env.RECEIPTS_DESTINATION,
        //         invoiceTemplate.subject(),
        //         invoiceTemplate.body(details)
        //     );
        //     tasks.push(task);
        // }

        // Wait for all emails to be sent
        // await Promise.all(tasks);
    }

    async sendShipmentUpdateEmail(shipment) {
        const tasks = [];

        const shippingClient = this.clients.get('shipping');
        if (shippingClient) {
            const task = shippingClient.sendMail(
                process.env.SHIPPING_DESTINATION,
                shippingTemplate.subject(shipment),
                shippingTemplate.body(shipment)
            );
            tasks.push(task);
        }
    }
}

const emailService = Object.freeze(new EmailService());
module.exports = emailService;
