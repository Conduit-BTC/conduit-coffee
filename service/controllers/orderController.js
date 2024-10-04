const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { addInvoiceToOrder } = require('../utils/invoiceUtils');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateShippingCost } = require('../utils/shippingUtils');
const { randomUUID } = require('crypto');

exports.getAllOrders = async (_, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { cart: true },
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createOrder = async (req, res) => {
  console.log('Creating Order...');
  const strikeKey = process.env.STRIKE_API_KEY;

  if (!strikeKey) {
    console.error('Environment Variable missing: STRIKE_API_KEY');
    return;
  }

  try {
    const {
      first_name,
      last_name,
      address1,
      address2,
      zip,
      special_instructions,
      email,
      cart,
    } = req.body;

    const currentSatsPrice = await getCurrentSatsPrice();

    const cartItems = cart.items.map((item) => {
      return {
        productId: item.id,
        quantity: item.quantity,
        weight: item.weight,
      };
    });

    const usdShippingCost = await calculateShippingCost(zip, cartItems);
    const satsShippingCost = usdShippingCost * currentSatsPrice;

    const createdOrder = await prisma.order.create({
      data: {
        first_name,
        last_name,
        address1,
        address2,
        zip,
        special_instructions,
        email,
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

    // Generate Strike Invoice
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${strikeKey}`);

    var body = JSON.stringify({
      correlationId: randomUUID(),
      description: 'Invoice for Order #' + createdOrder.id || '__________',
      amount: {
        currency: 'USD',
        amount: cart.usd_cart_price,
      },
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      data: body,
    };

    fetch(`https://api.strike.me/v1/invoices`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        res.json({ invoiceUrl: data.checkoutLink });
        addInvoiceToOrder(data.invoiceId, createdOrder.id).then((result) => {
          if (result) console.log('Invoice added to order:' + createdOrder.id);
          if (result) return res.status(200);
          else return res.status(400);
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
