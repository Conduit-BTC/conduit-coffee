const express = require('express');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/orders/', orderController.getOrderById);
router.get('/orders/all', orderController.getAllOrders);
router.get('/export/orders', adminController.exportOrdersCsv);
router.get('/export/products', adminController.exportProductsCsv);
router.get('/orders/details/:id', adminController.generateReceiptDetails);
router.post('/products/samples', productController.createSampleProducts);
router.delete('/products/delete/:id', productController.deleteProductById);
// router.get('/test/email/shipping', adminController.sendShippingTestEmail)
// router.post('/test/email/receipts/:invoiceId', adminController.sendReceiptTestEmail);

module.exports = router;
