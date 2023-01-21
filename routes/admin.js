const express = require('express');
const router = express.Router();

const { register, login, getUsers, getUser, getTotalRegisteredUsers, getTotalRegisteredUsersToday, getTotalMinedBalance } = require('../controllers/admin');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.get('/total-registered-users', getTotalRegisteredUsers);
router.get('/total-registered-users-today', getTotalRegisteredUsersToday);
router.get('/total-mined-balance', getTotalMinedBalance);


module.exports = router;

