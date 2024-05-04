const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController.cjs');

const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('pdfFiles'), pdfController.uploadPDF);

module.exports = router;
