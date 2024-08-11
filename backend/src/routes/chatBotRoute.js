const express = require('express');
const router = express.Router();
const { handleChatRequest } = require('../controllers/chatBotControllers.js');

router.post('/chat', handleChatRequest);

module.exports = router;
