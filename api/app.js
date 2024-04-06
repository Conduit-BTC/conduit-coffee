const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(
  bodyParser.json({
    verify: (req, _, buf) => {
      req.rawBody = buf;
    },
  }),
);

// Import and use route handlers
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/orders', orderRoutes);
app.use('/invoices', invoiceRoutes);

// Start the server
const port = process.env.PORT || 3456;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
