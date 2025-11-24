const express = require('express');
const router = express.Router();
const chatCtrl = require('../controllers/chatController');

router.get('/:accessCode/messages', chatCtrl.getMessages);
router.post('/:accessCode/messages', chatCtrl.sendMessage);

module.exports = router;
