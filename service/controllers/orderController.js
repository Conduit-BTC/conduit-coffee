const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { addInvoiceToOrder } = require('../utils/invoiceUtils');
const { calculateShippingCost } = require('../utils/shippingUtils');
const { randomUUID } = require('crypto');

const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

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
  // See https://docs.strike.me/walkthrough/receiving-payments
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
    const satsShippingCost = (usdShippingCost * currentSatsPrice);

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

    const fullAmount = (cart.sats_cart_price + satsShippingCost) / 100000000;
    const testAmount = 0.00000001;

    const useTestPayment = process.env.USE_TEST_PAYMENT_AMOUNT === 1;

    console.log("Use Test Payment:", useTestPayment);
    console.log(process.env.USE_TEST_PAYMENT_AMOUNT);

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
        addInvoiceToOrder(data.invoiceId, createdOrder.id).then((result) => {
          if (result) console.log('Invoice added to order:' + createdOrder.id);
          if (result) res.json({ lightningInvoice, invoiceId: data.invoiceId }, 200);
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
