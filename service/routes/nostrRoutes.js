// routes/nostrRoutes.js
const express = require('express');
const router = express.Router();
const nostrController = require('../controllers/nostrController');

router.get('/npub/:npub/relaypool', nostrController.getRelayPool);
router.post('/npub/relaypool', nostrController.createRelayPool);
router.post('/receipts/send/:invoiceId', nostrController.sendReceiptViaDm);
router.delete('/npub/:npub/relaypool', nostrController.deleteRelayPool);

module.exports = router;
