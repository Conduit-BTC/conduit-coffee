// routes/nostrRoutes.js
const express = require('express');
const router = express.Router();
const nostrController = require('../controllers/nostrController');

router.post('/receipts/send', nostrController.sendReceiptViaDm);

module.exports = router;
