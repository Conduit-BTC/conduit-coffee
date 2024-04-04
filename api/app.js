const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Import and use route handlers
const orderRoutes = require('./routes/orderRoutes');
app.use('/', orderRoutes);

// Start the server
const port = process.env.PORT || 3456;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
