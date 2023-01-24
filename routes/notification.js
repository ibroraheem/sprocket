const express = require('express');
const router = express.Router();

const { newNotification, getNotifications, getNotification, deleteNotification } = require('../controllers/notification');

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/user/:id', getUser);

module.exports = router;