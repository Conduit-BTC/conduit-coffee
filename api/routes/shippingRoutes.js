const express = require('express');
const shippingController = require('../controllers/shippingController');

const router = express.Router();

router.post('/rate', shippingController.calculateShippingRate);

module.exports = router;
