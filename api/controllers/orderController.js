const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');
const { addInvoiceToOrder } = require('../utils/invoiceUtils');
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
      address1,
      address2,
      zip,
      special_instructions,
      email,
      cart,
    } = req.body;

    const currentSatsPrice = await getCurrentSatsPrice();

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
            products: cart.products,
          },
        },
      },
      include: { cart: true },
    });

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `token ${process.env.BTCPAY_API_KEY}`);

    var body = JSON.stringify({
      metadata: {
        orderId: createdOrder.id,
      },
      receipt: {
        enabled: true,
        showQR: true,
        showPayments: true,
      },
      amount: currentSatsPrice * createdOrder.cart.usd_cart_price,
      currency: 'Sats',
    });

    var requestOptions = {
      method: 'POST',
      headers: headers,
      body: body,
      redirect: 'follow',
    };

    fetch(
      'https://btcpay0.voltageapp.io/api/v1/stores/enevfPMDK4coPh5yps6T8Z55qWMSYPesffazn95Lduz/invoices',
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        res.json({ invoiceUrl: result.checkoutLink });
        addInvoiceToOrder(result.id, createdOrder.id).then((result) => {
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
