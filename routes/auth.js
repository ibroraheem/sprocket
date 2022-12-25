const express = require('express');
const router = express.Router();

const { register, login, verifyOtp } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verifyOtp', verifyOtp);

module.exports = router;

