const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.getAllOrders);
// router.post('/', orderController.createOrder);
router.post('/pos', orderController.createPointOfSaleOrder);

module.exports = router;
