const express = require('express');
const tickerController = require('../controllers/tickerController');

const router = express.Router();

router.get('/sats', tickerController.sats);

module.exports = router;
