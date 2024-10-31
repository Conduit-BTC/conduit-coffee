const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/export/orders', adminController.exportOrdersCsv);
router.get('/export/products', adminController.exportProductsCsv);
router.post('/test/email/receipts/:invoiceId', adminController.sendReceiptTestEmail);
// router.get('/test/email/shipping', adminController.sendShippingTestEmail)

module.exports = router;
