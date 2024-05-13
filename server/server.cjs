const express = require('express');
const app = express();
const cors = require('cors');
const chroma = require("chromadb");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

const pdfRoutes = require('./routes/pdfRoutes.cjs');
const chatRoutes = require('./routes/chatRoutes.cjs');
const searchRoutes = require('./routes/searchRoutes.cjs');
const xlsxTojsonRoutes = require('./routes/xlsxTojsonRoutes.cjs');

const uploadDirectory = path.join(__dirname, 'uploads');
const xlsxDirectory = path.join(__dirname, "xlsxFiles");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Configuration de multer pour récupérer les fichiers XLSX
const xlsxStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, xlsxDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadXLSX = multer({ storage: xlsxStorage });

app.get("/api/xlsx-files", (req, res) => {
  fs.readdir(xlsxDirectory, (err, files) => {
    if (err) {
      console.error("Erreur lors de la récupération des fichiers XLSX :", err);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des fichiers XLSX." });
      return;
    }
    res.json({ files });
  });
});

// Endpoint pour le téléchargement de fichiers XLSX
app.post("/api/upload-xlsx", uploadXLSX.single("xlsxFile"), (req, res) => {
  // Traitez les fichiers XLSX téléchargés ici
  res.send("Fichier XLSX téléversé avec succès !");
});


const upload = multer({ storage });


app.delete('/api/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(uploadDirectory, fileName);

  // Vérifier si le fichier existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).json({ error: 'Le fichier spécifié n\'existe pas.' });
      return;
    }

    // Supprimer le fichier
    fs.unlink(filePath, err => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du fichier.' });
        return;
      }
      res.json({ message: 'Le fichier a été supprimé avec succès.' });
    });
  });
});



app.post('/api/upload1-pdf', upload.array('pdfFiles'), (req, res) => {
    // Traitez les fichiers téléchargés ici
    res.send('Fichiers téléversés avec succès !');
  });

app.get('/api/files', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
      if (err) {
        console.error('Erreur lors de la lecture du dossier des téléchargements :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des fichiers.' });
        return;
      }
      // Filtrer les fichiers cachés
      const filteredFiles = files.filter(file => !file.startsWith('.'));
      res.json({ files: filteredFiles });
    });
  });

app.use('/api', chatRoutes);
app.use('/api', pdfRoutes); // Utilisez le fichier de routes pour les fichiers PDF
app.use('/api',searchRoutes);
app.use('/api',xlsxTojsonRoutes);






const port = 5000;
app.listen(port, () => {
    console.log(`server started on  ${port}`);
});
