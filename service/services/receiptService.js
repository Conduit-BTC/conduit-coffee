
const { eventBus } = require('../events/eventBus');
const { InvoiceEvents } = require('../events/eventTypes');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');

class ReceiptService {
    constructor() {
        eventBus.subscribe(InvoiceEvents.INVOICE_PAID, broadcastReceiptDetails);
    }
}

async function broadcastReceiptDetails(invoiceId) {
    console.log(`Generating receipt details for invoice ID: ${invoiceId}`);
    const details = await generateReceiptDetailsObject(invoiceId);
    eventBus.emit(InvoiceEvents.RECEIPT_CREATED, invoiceId, details);
}

const receiptService = Object.freeze(new ReceiptService());
module.exports = receiptService;
