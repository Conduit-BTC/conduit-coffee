const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();


const InvoiceStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
}

async function addInvoiceToOrder(invoiceId, orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: InvoiceStatus.PENDING,
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  return true;
}

async function voidOrder(orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: InvoiceStatus.EXPIRED,
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  return true;
}

/*
  Response example:

  {
    "invoiceId": "c4d629f1-40af-4dfd-a09e-29aff38e9e87",
    "amount": {
        "amount": "0.00000001",
        "currency": "BTC"
    },
    "state": "PAID",
    "created": "2024-10-29T23:03:08.121309+00:00",
    "correlationId": "21c0df57-b894-4366-a155-c613b6a8532b",
    "description": "Invoice for Order #0b19d5d8-1ccd-4bb6-8c40-ae7d02a2559d",
    "issuerId": "7ec6a050-309f-434a-8a02-531e3b499c93",
    "receiverId": "7ec6a050-309f-434a-8a02-531e3b499c93"
  }

*/
async function getStrikeInvoiceDetails(invoiceId) {
  try {
    const status = await fetch(`https://api.strike.me/v1/invoices/${invoiceId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STRIKE_API_KEY}`,
      }
    });
    const data = await status.json();
    if (data) return data;
    throw new Error('No data returned from Strike API');
  } catch (error) {
    throw new Error('Error checking invoice status:', error);
  }
}

async function checkInvoiceStatus(invoiceId) {
  try {
    const status = await fetch(`https://api.strike.me/v1/invoices/${invoiceId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STRIKE_API_KEY}`,
      }
    });
    const data = await status.json();
    if (data.state) return data.state;
    return 'ERROR';
  } catch (error) {
    throw new Error('Error checking invoice status:', error);
  }
}

module.exports = { addInvoiceToOrder, voidOrder, checkInvoiceStatus, getStrikeInvoiceDetails, InvoiceStatus };
