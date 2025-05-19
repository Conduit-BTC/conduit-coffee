const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config({ path: './.env' });

// Initialize services
require('./services/dbService');
require('./services/shippingService');
require('./services/orderService');
require('./services/emailService');
require('./services/nostrService');
require('./services/receiptService');

// Initialize express and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
const wsService = require('./services/wsService');
wsService.initialize(server);

app.use(
  cors({
    origin: [
      'https://conduit.coffee',
      'https://conduit-coffee-dev.up.railway.app',
      'https://conduit-coffee-staging.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

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
  ['/admin/*', '/products/samples'],
  basicAuth({
    users: {
      [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD,
    },
    challenge: true,
    realm: 'Protected Area',
  }),
);

// Routes
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tickerRoutes = require('./routes/tickerRoutes');
const nostrRoutes = require('./routes/nostrRoutes');

app.use('/orders', orderRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/products', productRoutes);
app.use('/shipping', shippingRoutes);
app.use('/admin', adminRoutes);
app.use('/ticker', tickerRoutes);
app.use('/nostr', nostrRoutes);

// Start the server
const port = process.env.PORT || 3456;
server.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
});

console.log('Node ENV: ', process.env.APP_ENV);

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});
