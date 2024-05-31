const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.cjs');

// Définissez la route POST pour gérer les interactions avec le chatbot
router.post('/', chatController.processChat);

module.exports = router;
