const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController.cjs');
const loginController = require('../controllers/loginController.cjs');

router.post('/register', userController.addUser);
router.post('/login', loginController.loginUser);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
