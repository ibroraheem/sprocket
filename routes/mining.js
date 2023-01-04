const express = require('express');
const router = express.Router();

const { mine } = require('../controllers/mining');

router.post('/mine', mine);

module.exports = router;

