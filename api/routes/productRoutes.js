const express = require('express');
const orderController = require('../controllers/productController');

const router = express.Router();

router.get('/all', orderController.getAllProducts);
router.post('/samples', orderController.createSampleProducts);

module.exports = router;
