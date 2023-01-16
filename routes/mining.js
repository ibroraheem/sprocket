const express = require('express');
const router = express.Router();

const { mine, stopMining, balance  } = require('../controllers/mining');

router.post('/mine', mine);
router.post('/stop-mining', stopMining);
router.get('/balance', balance);

module.exports = router;

