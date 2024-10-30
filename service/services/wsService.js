// services/wsService.js
const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const WebSocket = require('ws');

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
            console.log('WebSocket connection handler registered');
        }

        return this;
    }

    handleConnection(ws) {
        console.log('New WebSocket connection established');

        // Send initial connection acknowledgment
        ws.send(JSON.stringify({ type: 'CONNECTED' }));

        ws.on('message', (message) => this.handleMessage(ws, message));
        ws.on('close', () => this.handleDisconnect(ws));
        ws.on('error', this.handleError);
    }

    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message.toString()); // Add toString() to handle Buffer

            if (data.type === 'WATCH_INVOICE') {
                const { invoiceId } = data;
                console.log(`Client watching invoice: ${invoiceId}`);

                // Remove any existing connection for this invoice
                if (this.connections.has(invoiceId)) {
                    const existingWs = this.connections.get(invoiceId);
                    if (existingWs !== ws && existingWs.readyState === WebSocket.OPEN) {
                        existingWs.close();
                    }
                }

                this.connections.set(invoiceId, ws);
                ws.invoiceId = invoiceId;

                // Acknowledge watching
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
            console.log(`Client disconnected from invoice: ${ws.invoiceId}`);
            this.connections.delete(ws.invoiceId);
        }
    }

    handleError(error) {
        console.error('WebSocket error:', error);
    }

    notifyPaymentReceived(invoiceId) {
        console.log("WebSocketService.notifyPaymentReceived", invoiceId);
        const ws = this.connections.get(invoiceId);

        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                const message = JSON.stringify({
                    type: 'PAYMENT_RECEIVED',
                    invoiceId: invoiceId,
                    timestamp: new Date().toISOString()
                });

                ws.send(message);
                console.log(`Payment notification sent for invoice ${invoiceId}`);

                // Delay connection cleanup to ensure message delivery
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
