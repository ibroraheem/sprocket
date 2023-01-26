const express = require('express');
const router = express.Router();

const { register, login, getUsers, getUser, getAnalytics, addVersion, getLatestVersion } = require('../controllers/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.get('/analytics', getAnalytics);
router.post('/add-version', addVersion);
router.get('/versions', getLatestVersion);


module.exports = router;

