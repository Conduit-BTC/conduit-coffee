const { checkInvoiceStatus, InvoiceStatus } = require('../utils/invoiceUtils');
const { InvoiceEvents } = require('../events/eventTypes');
const { eventBus } = require('../events/eventBus');

exports.handleInvoiceWebhook = async (req, res) => {
  try {
    res.status(200).json({ received: true });

    console.log('Received invoice webhook. Body: ', req.body);

    const invoiceId = req.body.data?.entityId;

    if (!invoiceId) {
      console.warn('No entityId (invoiceId) in webhook request body: ', req.body);
      return;
    }

    if (!req.body.eventType || req.body.eventType !== 'invoice.updated') return;

    const invoiceStatus = await checkInvoiceStatus(invoiceId); // Verify that this is a legitimate paid invoice

    if (invoiceStatus !== InvoiceStatus.PAID) return;

    console.log("Paid invoice received. Emitting event to create shipment");

    eventBus.emit(InvoiceEvents.INVOICE_PAID, invoiceId);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: 'Server Error' });
    console.error(
      'invoiceController.js - Error processing request to /invoices: ',
    );
    console.error(error.message);
    console.error('Stack trace:', error.stack);
  }
};
