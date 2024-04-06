const { PrismaClient } = require('@prisma/client');
const { verifySignature } = require('../utils/verifySignature');
const { log } = require('../utils/log');
const prisma = new PrismaClient();

exports.settleInvoice = async (req, res) => {
  try {
    const isValid = await validateRequest(req);
    if (!isValid) {
      res.status(401);
      console.error('Unauthorized request! - ' + stringifyRequest(req));
      return;
    }
  } catch (err) {
    res.status(500);
    throw new Error(
      'invoiceController.js - Error validating POST request to /invoices',
    );
  }

  try {
    switch (req.body.type) {
      case 'InvoiceSettled':
        const ps = processPaidOrder(req.body);
        if (ps) res.status(200);
        else res.status(500);
        break;
      case 'InvoiceExpired' || 'InvoiceInvalid':
        const vs = voidOrder(req.body);
        if (vs) res.status(200);
        else res.status(500);
        break;
      case 'InvoiceCreated':
        const as = addInvoiceToOrder(req.body);
        if (as) res.status(200);
        else res.status(500);
        break;
      default:
        res.status(500);
        throw Error();
    }
  } catch (err) {
    res.status(500);
    throw new Error(
      'invoiceController.js - Error processing request to /invoices',
    );
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

async function addInvoiceToOrder(data) {
  const { invoiceId, metadata } = data;
  const { orderId } = metadata;

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'pending',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # addInvoiceToOrder() - Order wasn't found. Order ID: ${orderId} - Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

async function voidOrder(data) {
  const { invoiceId } = data;

  const updatedOrder = await prisma.order.update({
    where: {
      invoiceId: invoiceId,
    },
    data: {
      invoiceStatus: 'expired',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # voidOrder() - Invoice wasn't found. Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

async function processPaidOrder(data) {
  const { invoiceId } = data;

  const updatedOrder = await prisma.order.update({
    where: {
      invoiceId: invoiceId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'paid',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # processPaidOrder() - Invoice wasn't found. Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

function stringifyRequest(req) {
  const { method, url, headers, params, query, body } = req;

  const requestDetails = {
    method,
    url,
    headers,
    params,
    query,
    body,
  };

  return JSON.stringify(requestDetails, null, 2);
}
