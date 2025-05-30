// orderController.js
const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { addInvoiceToOrder } = require('../utils/invoiceUtils');
const { calculateShippingCost } = require('../utils/shippingUtils');
const { randomUUID } = require('crypto');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');

const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

exports.getAllOrders = async (_, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { cart: true },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.query;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { cart: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.createOrder = async (req, res) => {
  const strikeKey = process.env.STRIKE_API_KEY;

  if (!strikeKey) {
    console.error('Environment Variable missing: STRIKE_API_KEY');
    return;
  }

  console.log('Creating Order...');

  try {
    const {
      first_name,
      last_name,
      address1,
      address2,
      zip,
      special_instructions,
      cart,
    } = req.body;

    const currentSatsPrice = await getCurrentSatsPrice();

    if (!currentSatsPrice) {
      console.error('Error fetching current sats price');
      return res.status(500).json({ error: 'Server Error' });
    }

    const cartItems = cart.items.map((item) => {
      return {
        productId: item.id,
        quantity: item.quantity,
        weight: item.weight,
      };
    });

    const shipCostReq = await calculateShippingCost(zip, cartItems);
    if (!shipCostReq.success) {
      if (!shipCostReq.error) return res.status(500).json({ error: 'Error calculating shipping cost' });
      return res.status((shipCostReq.error.status || 500)).json({ error: shipCostReq.error.message });
    }

    const usdShippingCost = shipCostReq.cost;
    const satsShippingCost = (usdShippingCost * currentSatsPrice);

    const createdOrder = await prisma.order.create({
      data: {
        first_name,
        last_name,
        address1,
        address2,
        zip,
        special_instructions,
        cart: {
          create: {
            sats_cart_price: cart.sats_cart_price,
            usd_cart_price: cart.usd_cart_price,
            shipping_cost_usd: usdShippingCost,
            shipping_cost_sats: satsShippingCost,
            items: cartItems.map((item) => JSON.stringify(item)),
          },
        },
      },
      include: { cart: true },
    });

    // See https://docs.strike.me/walkthrough/receiving-payments

    // Generate Strike Invoice
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${strikeKey}`);

    const fullAmount = (cart.sats_cart_price + satsShippingCost) / 100000000;
    const testAmount = 0.000000011234;

    const useTestPayment = process.env.USE_TEST_PAYMENT_AMOUNT === "true";

    if (useTestPayment) console.warn(`>>> DEV MODE: Using test payment amount of ${testAmount} Satoshi <<<`);

    var body = JSON.stringify({
      correlationId: randomUUID(),
      description: 'Invoice for Order #' + (createdOrder.id || '__________'),
      amount: {
        currency: 'BTC',
        amount: useTestPayment ? testAmount : fullAmount,
      },
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body,
    };

    fetch(`https://api.strike.me/v1/invoices`, requestOptions)
      .then((response) => response.json())
      .then(async (data) => {
        if (!data.invoiceId) {
          console.error('Error creating Strike invoice:', data);
          return res.status(500).json({ error: 'Error creating invoice' });
        }
        const lightningInvoice = await generateLightningInvoice(data.invoiceId);
        addInvoiceToOrder(data.invoiceId, createdOrder.id, lightningInvoice).then((result) => {
          if (result) console.log('Invoice added to order:' + createdOrder.id);
          if (result) res.status(200).json({
            lightningInvoice, invoiceId: data.invoiceId, usdShippingCost: usdShippingCost,
            satsShippingCost: satsShippingCost, usdCost: cart.usd_cart_price, satsCost: cart.sats_cart_price,
          });
          else return res.status(500);
        });
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Error creating invoice' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function generateLightningInvoice(invoiceId) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRIKE_API_KEY}`,
        'ContentLength': 0,
      }
    }

    const lightningInvoice = await fetch(`https://api.strike.me/v1/invoices/${invoiceId}/quote`, options)
      .then((response) => response.json())
      .then((data) => {
        return data.lnInvoice;
      })
    return lightningInvoice;
  } catch (error) {
    throw new Error('Error generating Strike quote:', error);
  }
}
