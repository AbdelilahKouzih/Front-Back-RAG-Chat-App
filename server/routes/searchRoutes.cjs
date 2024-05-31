const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController.cjs');

// Définissez la route POST pour gérer les interactions avec le chatbot
router.post('/', searchController.processSearch);

module.exports = router;
