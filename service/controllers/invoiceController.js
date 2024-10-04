const { stringifyRequest } = require('../utils/stringifyRequest');
const { processPaidOrder, voidOrder } = require('../utils/invoiceUtils');
const {
  createShipStationOrder,
  updateOrderShipstationId,
} = require('../utils/shippingUtils');

exports.handleInvoiceWebhook = async (req, res) => {
  console.log('Received invoice webhook');
  try {
    const isValid = await validateRequest(req);
    if (!isValid) {
      console.log('Unauthorized request!');
      res.status(401).json({ message: 'Unauthorized', error: 'Unauthorized' });
      console.error('Unauthorized request! - ' + stringifyRequest(req));
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: 'Server Error' });
    console.error(
      'invoiceController.js - Error validating POST request to /invoices',
    );
    console.error(error.message);
    console.error('Stack trace:', error.stack);
    return;
  }

  try {
    const orderId = req.body.metadata?.orderId;
    if (!orderId) {
      console.log('No order ID!');
      console.log(req.body);
      return res
        .status(400)
        .json({ message: 'Missing Order ID', error: 'Missing Order ID' });
    }

    switch (req.body.type) {
      case 'InvoiceSettled':
        const ps = await processPaidOrder(orderId);
        if (ps) {
          const shipId = await createShipStationOrder(orderId);
          if (shipId) {
            await updateOrderShipstationId(orderId, shipId.toString());
          }
          return res.status(200).json({ message: 'Success!' });
        }
      case 'InvoiceExpired':
      case 'InvoiceInvalid':
        const vs = await voidOrder(orderId);
        if (vs) return res.status(200).json({ message: 'Success!' });
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
