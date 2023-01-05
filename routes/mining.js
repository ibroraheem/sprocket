const express = require('express');
const router = express.Router();

const { mine, stopMining } = require('../controllers/mining');

router.post('/mine', mine);
router.post('/stop-mining', stopMining);

module.exports = router;

