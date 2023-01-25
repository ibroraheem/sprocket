const express = require('express');
const router = express.Router();

const { newFeedBack, getFeedBacks, getFeedBack, deleteFeedBack } = require('../controllers/notification');

router.post('/new', newFeedBack);
router.get('/', getFeedBacks);
router.get('/:id', getFeedBack);
router.delete('/:id', deleteFeedBack);

module.exports = router;