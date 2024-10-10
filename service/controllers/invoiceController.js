const { processPaidOrder } = require('../utils/invoiceUtils');
const {
  createShipment,
  updateShipment,
} = require('../utils/shippingUtils');

const { checkInvoiceStatus } = require('../utils/invoiceUtils');

exports.handleInvoiceWebhook = async (req, res) => {
  console.log('Received invoice webhook');

  try {
    const orderId = req.body.data?.entityId;
    if (!orderId) {
      console.log('No order ID in webhook request');
      console.log(req.body);
      return res
        .status(400)
        .json({ message: 'Missing Order ID', error: 'Missing Order ID' });
    }

    switch (req.body.eventType) {
      case 'invoice.created':
        return res.status(200).json({ message: 'Webhook received' });
      case 'invoice.updated':
        const invoiceStatus = await checkInvoiceStatus(orderId);
        if (invoiceStatus !== 'PAID') return res.status(200).json({ message: 'Webhook received' });

        const ps = await processPaidOrder(orderId);

        if (ps) {
          const shipId = await createShipment(orderId);

          if (shipId) {
            await updateOrderWithShipmentId(orderId, shipId.toString());
          }
          return res.status(200).json({ message: 'Success!' });
        }
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
