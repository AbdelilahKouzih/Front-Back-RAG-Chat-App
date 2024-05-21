const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController.cjs');
const loginController = require('../controllers/loginController.cjs');

router.post('/register', userController.addUser);
router.post('/login', loginController.loginUser);

module.exports = router;
