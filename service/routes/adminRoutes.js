const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/export/orders', adminController.exportOrdersCsv);
router.get('/export/products', adminController.exportProductsCsv);

module.exports = router;
