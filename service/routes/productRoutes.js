const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/all', productController.getAllProducts);
router.post('/samples', productController.createSampleProducts);

module.exports = router;