const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController.cjs');

const upload = multer({ dest: 'uploads/' });

router.post('/',pdfController.uploadPDF);

module.exports = router;
