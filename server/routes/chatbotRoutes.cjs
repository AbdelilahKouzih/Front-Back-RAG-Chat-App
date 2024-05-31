const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const chatbotController = require('../controllers/chatbotController.cjs');

const uploadDirectory = path.join(__dirname, '../chatBotFiles');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), chatbotController.uploadFile);
router.get('/files', chatbotController.getFiles);
router.delete('/files/:fileName', chatbotController.deleteFile);
router.post('/', chatbotController.processChat);

module.exports = router;
