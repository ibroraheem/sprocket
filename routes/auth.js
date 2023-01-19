const express = require('express');
const router = express.Router();

const { register, login, logout, userInfo } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user-info', userInfo);


module.exports = router;

