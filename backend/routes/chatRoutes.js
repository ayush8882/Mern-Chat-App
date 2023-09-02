const express = require('express');
const router = express.Router()
const auth = require('../middlewares/authMiddleware');
const {accessChat, fetchChat, createGroupChat, renameGroupChat, removeFromGroup, addToGroup} = require('../controllers/chatController');


router.post('/', auth, accessChat);
router.get('/', auth, fetchChat);
router.post('/group', auth, createGroupChat);
router.put('/rename', auth, renameGroupChat);
router.put('/remove', auth, removeFromGroup);
router.put('/groupadd', auth, addToGroup);

module.exports = router;