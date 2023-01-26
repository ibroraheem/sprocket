const express = require('express');
const router = express.Router();

const { register, login, getUsers, getUser, getAnalytics, newVersion, getVersion } = require('../controllers/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.get('/analytics', getAnalytics);
router.post('/new-version', newVersion);
router.get('/versions', getVersion);


module.exports = router;

