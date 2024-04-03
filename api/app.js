const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Import and use route handlers
const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
