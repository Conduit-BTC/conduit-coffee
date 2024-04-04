const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.get("/getAllOrders", orderController.getAllOrders);
router.post("/newOrder", orderController.createOrder);

module.exports = router;
