const express = require('express');
const router = express.Router();

const { newNotification, getNotifications, getNotification, deleteNotification } = require('../controllers/notification');

router.post('/new', newNotification);
router.get('/', getNotifications);
router.get('/:id', getNotification);
router.delete('/:id', deleteNotification);



module.exports = router;