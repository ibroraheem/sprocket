const express = require('express');
const router = express.Router();

const { purchase, getMspocInfo, claimMspoc } = require('../controllers/grease.store');

router.post('/purchase', purchase);
router.get('/get-mspoc-info', getMspocInfo);
router.patch('/claim-mspoc', claimMspoc);

module.exports = router;