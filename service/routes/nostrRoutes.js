// routes/nostrRoutes.js
const express = require('express');
const router = express.Router();
const nostrController = require('../controllers/nostrController');

router.post('/npub/relaypool', nostrController.createRelayPool);

module.exports = router;
