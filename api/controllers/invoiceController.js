const { verifySignature } = require('../utils/verifySignature');
const { stringifyRequest } = require('../utils/stringifyRequest');
const { processPaidOrder, voidOrder } = require('../utils/invoiceUtils');
const {
  createShipStationOrder,
  updateOrderShipstationId,
} = require('../utils/shippingUtils');

exports.settleInvoice = async (req, res) => {
  try {
    const isValid = await validateRequest(req);
    if (!isValid) {
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
  }

  try {
    const orderId = req.body.metadata?.orderId;
    if (!orderId)
      return res
        .status(400)
        .json({ message: 'Missing Order ID', error: 'Missing Order ID' });

    switch (req.body.type) {
      case 'InvoiceSettled':
        const ps = processPaidOrder(orderId);
        if (ps) {
          createShipStationOrder(orderId);
          return res.status(200).json({ message: 'Success!' });
        }
      case 'InvoiceExpired' || 'InvoiceInvalid':
        const vs = voidOrder(orderId);
        if (vs) return res.status(200).json({ message: 'Success!' });
      default:
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
  const secret = process.env.BTCPAY_INVOICE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      'invoiceController.js # validateRequest() - Missing ENV Variable',
    );
  }
  const btcPaySig = req.get('btcpay-sig');
  if (typeof btcPaySig !== 'string') return false;
  const isValid = await verifySignature(secret, btcPaySig, req.rawBody);
  return isValid;
}
