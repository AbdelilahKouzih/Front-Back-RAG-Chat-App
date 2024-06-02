const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController.cjs');
const { addChatHistory, getChatHistory,getChatHistoryByid,deleteChatHistory } = require('../controllers/chatHistoryController.cjs');

// Définissez la route POST pour gérer les interactions avec le chatbot
router.post('/addChatHistory', addChatHistory);
router.get('/getChatHistory/:userId', getChatHistory);
router.get('/getChatHistorybyid/:chatId', getChatHistoryByid);
router.post('/', chatController.processChat);
router.delete('/deleteChatHistory/:chatId', deleteChatHistory); // Nouvelle route pour supprimer un historique de chat

module.exports = router;
