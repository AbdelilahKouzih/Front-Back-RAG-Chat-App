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

const uploadDirectory = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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


const port = 5000;
app.listen(port, () => {
    console.log(`server started on  ${port}`);
});
