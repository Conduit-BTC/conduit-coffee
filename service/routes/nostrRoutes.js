// routes/nostrRoutes.js
const express = require('express');
const router = express.Router();
const nostrController = require('../controllers/nostrController');

router.post('/npub/relaypool', nostrController.createRelayPool);
router.get('/npub/:npub/relaypool', nostrController.getRelayPool);
router.delete('/npub/:npub/relaypool', nostrController.deleteRelayPool);

module.exports = router;
