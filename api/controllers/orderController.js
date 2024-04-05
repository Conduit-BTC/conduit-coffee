const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  try {
    const {
      first_name,
      last_name,
      address,
      zip,
      special_instructions,
      email,
      cart,
    } = req.body;

    const currentSatsPrice = await getCurrentSatsPrice();

    console.log('Creating order...');

    const createdOrder = await prisma.order.create({
      data: {
        first_name,
        last_name,
        address,
        zip,
        special_instructions,
        email,
        cart: {
          create: {
            sats_price: currentSatsPrice * cart.cart_price,
            cart_price: cart.cart_price,
            light_roast: cart.light_roast,
            dark_roast: cart.dark_roast,
          },
        },
      },
      include: { cart: true },
    });

    console.log('Order created!');
    console.log('Creating invoice...');

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `token ${process.env.BTCPAY_API_KEY}`);

    var raw = JSON.stringify({
      metadata: {
        orderId: createdOrder.id,
      },
      receipt: {
        enabled: true,
        showQR: true,
        showPayments: true,
      },
      amount: currentSatsPrice * createdOrder.cart.cart_price,
      currency: 'Sats',
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://btcpay0.voltageapp.io/api/v1/stores/enevfPMDK4coPh5yps6T8Z55qWMSYPesffazn95Lduz/invoices',
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('Invoice created!');
        res.json({ invoiceUrl: result.checkoutLink });
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
