const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'conduit-coffee-terminal.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

app.use(bodyParser.json());

// Import and use route handlers
const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

// Start the server
const port = process.env.PORT || 3456;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
