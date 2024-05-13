const express = require('express');
const router = express.Router();
const xlsxTojsonController = require("../controllers/xlsxTojsonController.cjs");
const multer = require('multer');
const upload = multer(); // Middleware de téléversement de fichiers

router.post('/xlsxtojson', upload.single('xlsxFile'), xlsxTojsonController.convertXLSXToJson);

module.exports = router;