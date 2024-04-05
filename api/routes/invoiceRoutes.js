const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', invoiceController.settleInvoice);

module.exports = router;
