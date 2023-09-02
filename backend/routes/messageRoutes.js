const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageController');
const router = express.Router()
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, sendMessage)
router.get('/:chatId', auth, allMessages)

module.exports = router;