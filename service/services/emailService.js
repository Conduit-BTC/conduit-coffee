const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { getStrikeInvoiceDetails } = require('../utils/invoiceUtils');
const { getOrderByInvoiceId, getCartByOrderId } = require('../utils/orderUtils');
const { ProtonMailProvider } = require('./emailProviders');
const { invoiceTemplate, shippingTemplate } = require('./templates');

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
                username: process.env.SHIPPING_EMAIL,
                token: process.env.SHIPPING_TOKEN,
            },
            receipts: {
                username: process.env.RECEIPTS_EMAIL,
                token: process.env.RECEIPTS_TOKEN,
            }
        };
    }

    setupEventListeners() {
        eventBus.on(InvoiceEvents.INVOICE_CREATED, this.handleInvoiceCreated.bind(this));
    }

    async handleInvoiceCreated(invoiceId) {
        try {
            const details = await this.generateInvoicePaidEmailDetails(invoiceId);
            await this.sendInvoicePaidEmail(details);
        } catch (error) {
            console.error('Failed to process invoice emails:', error);
            throw error;
        }
    }

    async generateInvoicePaidEmailDetails(invoiceId) {
        const invoice = await getStrikeInvoiceDetails(invoiceId);
        const order = await getOrderByInvoiceId(invoiceId);
        const cart = await getCartByOrderId(order.id);

        return {
            orderId: order.id,
            totalCost: invoice.amount.amount * 100000000, // Convert BTC to Sats
            date: invoice.created,
            items: cart.items
        }
    }

    async sendInvoicePaidEmail(details) {
        const tasks = [];

        const receiptClient = this.clients.get('receipts');
        if (receiptClient) {
            const task = receiptClient.sendMail(
                process.env.RECEIPTS_DESTINATION,
                invoiceTemplate.subject(),
                invoiceTemplate.body(details)
            );
            tasks.push(task);
        }

        // Wait for all emails to be sent
        await Promise.all(tasks);
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
module.exports = { emailService, EmailService };
