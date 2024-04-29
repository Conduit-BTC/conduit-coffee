const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = express();

app.use(cors());

app.use(
  bodyParser.json({
    verify: (req, _, buf) => {
      req.rawBody = buf;
    },
  }),
);

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('ENV VARS MISSING - ADMIN_USERNAME and ADMIN_PASSWORD');
  process.exit(1);
}

app.use(
  ['/admin/*', '/products/sample'],
  basicAuth({
    users: {
      [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD,
    },
    challenge: true,
    realm: 'Protected Area',
  }),
);

const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/orders', orderRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/products', productRoutes);
app.use('/shipping', shippingRoutes);
app.use('/admin', adminRoutes);

// Start the server
const port = process.env.PORT || 3456;
app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
});
