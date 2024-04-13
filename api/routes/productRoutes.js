const express = require('express');
const orderController = require('../controllers/productController');

const router = express.Router();

router.get('/all', orderController.getAllProducts);
router.get('/samples', orderController.createSampleProducts);

module.exports = router;
