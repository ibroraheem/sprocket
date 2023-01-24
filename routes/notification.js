const express = require('express');
const router = express.Router();

const { newNotification, getNotifications, updateNotification, deleteNotification } = require('../controllers/notification');

router.post('/new', newNotification);
router.get('/', getNotifications);
router.patch('/:id', updateNotification);
router.delete('/:id', deleteNotification);

module.exports = router;