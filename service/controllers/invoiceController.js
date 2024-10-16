const { processPaidOrder } = require('../utils/invoiceUtils');
const {
  createShipment,
  updateShipment,
} = require('../utils/shippingUtils');

const { checkInvoiceStatus } = require('../utils/invoiceUtils');

exports.handleInvoiceWebhook = async (req, res) => {
  console.log('Received invoice webhook');
  console.log(req.body);

  try {
    const invoiceId = req.body.data?.entityId;
    if (!invoiceId) {
      console.warn('No entityId (invoiceId) in webhook request');
      console.warn(req.body);
      return res
        .status(400)
        .json({ message: 'Missing Invoice ID', error: 'Missing Invoice ID' });
    }

    switch (req.body.eventType) {
      case 'invoice.created':
        return res.status(200).json({ message: 'Webhook received' });

      case 'invoice.updated':
        const result = await handleInvoiceUpdate(invoiceId);
        return res.status(result.status).json(result.message);

      default:
        console.log('Failed to process request');
        return res.status(400).json({ message: 'Failed to Process Request' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: 'Server Error' });
    console.error(
      'invoiceController.js - Error processing request to /invoices: ',
    );
    console.error(error.message);
    console.error('Stack trace:', error.stack);
  }
};

async function handleInvoiceUpdate(invoiceId) {
  const invoiceStatus = await checkInvoiceStatus(invoiceId);

  if (invoiceStatus !== 'PAID') return { status: 200, message: "Webhook received!" }

  const ps = await processPaidOrder(invoiceId);

  if (!ps) {
    console.log('Failed to process order');
    return { status: 400, message: 'Failed to Process Order' };
  }

  console.log('Creating shipment');

  const sh = await createShipment(invoiceId);

  if (!sh) {
    console.log('Failed to create shipment');
    return { status: 400, message: 'Failed to Create Shipment' };
  }

  console.log('Shipment created:', sh);

  return { status: 200, message: 'Success!' };
}

async function validateRequest(req) {
  const strikeWebhookSecret = process.env.STRIKE_INVOICE_WEBHOOK_SECRET;
  if (!strikeWebhookSecret) {
    throw new Error(
      'invoiceController.js # validateRequest() - Missing ENV Variable',
    );
  }
  console.log('BODY: ', req.body);
  return false;
}
