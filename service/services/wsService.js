// services/wsService.js
const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const WebSocket = require('ws');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');
const { invoiceTemplate } = require('./email/templates');

class WebSocketService {
    constructor() {
        this.connections = new Map();
        this.wss = null;

        this.handleConnection = this.handleConnection.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleError = this.handleError.bind(this);
        this.notifyPaymentReceived = this.notifyPaymentReceived.bind(this);

        eventBus.subscribe(InvoiceEvents.INVOICE_PAID, this.notifyPaymentReceived);
    }

    initialize(server) {
        if (!server) {
            throw new Error('Server instance is required for WebSocket initialization');
        }

        this.wss = new WebSocket.Server({ server });
        console.log('WebSocket server created');

        if (this.wss) {
            this.wss.on('connection', this.handleConnection);
        }

        return this;
    }

    handleConnection(ws) {
        ws.send(JSON.stringify({ type: 'CONNECTED' }));

        ws.on('message', (message) => this.handleMessage(ws, message));
        ws.on('close', () => this.handleDisconnect(ws));
        ws.on('error', this.handleError);
    }

    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'WATCH_INVOICE') {
                const { invoiceId } = data;

                if (this.connections.has(invoiceId)) {
                    const existingWs = this.connections.get(invoiceId);
                    if (existingWs !== ws && existingWs.readyState === WebSocket.OPEN) {
                        existingWs.close();
                    }
                }

                this.connections.set(invoiceId, ws);
                ws.invoiceId = invoiceId;

                ws.send(JSON.stringify({
                    type: 'WATCHING_CONFIRMED',
                    invoiceId: invoiceId
                }));
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid message format'
            }));
        }
    }

    handleDisconnect(ws) {
        if (ws.invoiceId) {
            this.connections.delete(ws.invoiceId);
        }
    }

    handleError(error) {
        console.error('WebSocket error:', error);
    }

    async notifyPaymentReceived(invoiceId) {
        const ws = this.connections.get(invoiceId);

        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                const details = await generateReceiptDetailsObject(invoiceId);

                const message = JSON.stringify({
                    type: 'PAYMENT_RECEIVED',
                    invoiceId: invoiceId,
                    receipt: invoiceTemplate.body(details),
                    timestamp: new Date().toISOString()
                });

                ws.send(message);

                setTimeout(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        this.connections.delete(invoiceId);
                        ws.close();
                    }
                }, 1000);
            } catch (error) {
                console.error(`Error sending payment notification for invoice ${invoiceId}:`, error);
            }
        } else {
            console.warn(`No active connection found for invoice ${invoiceId}`);
        }
    }

    getActiveConnections() {
        return this.connections.size;
    }
}

const wsService = new WebSocketService();
module.exports = wsService;
