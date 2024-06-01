const express = require("express");
const app = express();
const cors = require("cors");
const chroma = require("chromadb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chat-bot'; // Utilisez une clé secrète plus forte en production
const mysql = require('mysql');
const pdfRoutes = require("./routes/pdfRoutes.cjs");
const chatRoutes = require("./routes/chatRoutes.cjs");
const searchRoutes = require("./routes/searchRoutes.cjs");
const xlsxTojsonRoutes = require("./routes/xlsxTojsonRoutes.cjs");
const userRoutes = require("./routes/userRoutes.cjs");
const chatbotRoutes = require("./routes/chatbotRoutes.cjs"); // Ajoutez cette ligne
const uploadDirectory = path.join(__dirname, "uploads");
const xlsxDirectory = path.join(__dirname, "xlsxFiles");

// Créez une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat-bot'
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extraire le token sans 'Bearer '
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};


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
      res
        .status(500)
        .json({
          error: "Erreur serveur lors de la récupération des fichiers XLSX.",
        });
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

app.delete("/api/files/:fileName/:userId", verifyToken, (req, res) => {
  const { fileName, userId } = req.params;

  // Requête pour supprimer le fichier de la base de données
  const query = "DELETE FROM files WHERE user_id = ? and filename = ?";
  connection.query(query, [userId, fileName], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression du fichier depuis la base de données :", err);
      res.status(500).json({ error: "Erreur serveur lors de la suppression du fichier depuis la base de données." });
      return;
    }

    // Vérifiez si un fichier a été supprimé
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Le fichier spécifié n'existe pas dans la base de données." });
      return;
    }

    // Si la suppression s'est bien déroulée, renvoyer une réponse réussie
    res.json({ message: "Le fichier a été supprimé avec succès de la base de données." });
  });
});

/*
app.delete("/api/files/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(uploadDirectory, fileName);

  // Vérifier si le fichier existe
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).json({ error: "Le fichier spécifié n'existe pas." });
      return;
    }

    // Supprimer le fichier
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression du fichier :", err);
        res
          .status(500)
          .json({ error: "Erreur serveur lors de la suppression du fichier." });
        return;
      }
      res.json({ message: "Le fichier a été supprimé avec succès." });
    });
  });
});
*/
/*app.post("/api/upload1-pdf", upload.array("pdfFiles"), (req, res) => {
  // Traitez les fichiers téléchargés ici
  res.send("Fichiers téléversés avec succès !");
});
*/
app.post("/api/upload1-pdf", upload.array("pdfFiles"), verifyToken, async (req, res) => {
  try {
    const files = req.files; // Liste des fichiers téléversés
    const userId = parseInt(req.body.userId, 10); // Convertir userId en entier

    // Parcourez chaque fichier et enregistrez-le dans la base de données
    for (const file of files) {
      const filename = file.originalname;
      const fileData = fs.readFileSync(file.path); // Lire le fichier sous forme de données binaires

      // Enregistrez le fichier dans la base de données
      const query =
        "INSERT INTO files (user_id, filename, file_data) VALUES (?, ?, ?)";
         connection.query(query, [userId, filename, fileData]);
    }

    // Supprimez les fichiers du système de fichiers du serveur
    for (const file of files) {
      fs.unlinkSync(file.path);
    }

    res.send(
      "Fichiers téléversés avec succès et enregistrés dans la base de données !"
    );
  } catch (error) {
    console.error("Erreur lors du téléversement des fichiers :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors du téléversement des fichiers." });
  }
});

/*app.get("/api/files", (req, res) => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error(
        "Erreur lors de la lecture du dossier des téléchargements :",
        err
      );
      res
        .status(500)
        .json({
          error: "Erreur serveur lors de la récupération des fichiers.",
        });
      return;
    }
    // Filtrer les fichiers cachés
    const filteredFiles = files.filter((file) => !file.startsWith("."));
    res.json({ files: filteredFiles });
  });
});
*/
app.get("/api/files", verifyToken, (req, res) => {
  // Sélectionnez tous les fichiers depuis la base de données
  const query = "SELECT filename FROM files where user_id = ?";
  const userId = req.query.userId;

  connection.query(query,[userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des fichiers depuis la base de données :", err);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des fichiers depuis la base de données." });
      return;
    }
    
    // Extraire les noms de fichiers des résultats de la requête
    const files = results.map((result) => result.filename);
    res.json({ files });
  });
});

app.use("/api/user", userRoutes); // L'authentification initiale ne nécessite pas de token
app.use("/api/chat", verifyToken, chatRoutes);
app.use("/api/upload-pdf", verifyToken, pdfRoutes); // Utilisez le fichier de routes pour les fichiers PDF
app.use("/api/search", verifyToken, searchRoutes);
app.use("/api/xlsxtojson", verifyToken, xlsxTojsonRoutes);
app.use("/api/chatbot", chatbotRoutes); // Ajoutez cette ligne

const port = 5000;
app.listen(port, () => {
  console.log(`server started on  ${port}`);
});
