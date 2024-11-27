const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', invoiceController.handleInvoiceWebhook);
router.post('/email-receipt', invoiceController.emailReceipt);

module.exports = router;
