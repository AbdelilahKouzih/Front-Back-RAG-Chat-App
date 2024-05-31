const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chat-bot'; // Utilisez une clé secrète plus forte en production

// Créez une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat-bot'
});

// Définir la fonction de contrôleur pour l'authentification de l'utilisateur
exports.loginUser = (req, res) => {
  // Extraire les données du corps de la demande
  const { email, password } = req.body;

  // Récupérer l'utilisateur correspondant à l'e-mail fourni depuis la base de données
  const sql = 'SELECT * FROM users WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur dans la base de données :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la tentative de connexion.' });
      return;
    }

    if (results.length === 0) {
      // Aucun utilisateur trouvé avec cet e-mail
      res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
      return;
    }

    // Comparer le mot de passe haché avec celui fourni
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('Erreur lors de la comparaison des mots de passe :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la tentative de connexion.' });
        return;
      }

      if (!isMatch) {

        // Le mot de passe ne correspond pas
        res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
        return;
      }


      // Authentification réussie
      const { id, role } = results[0]; // Récupérer l'id de l'utilisateur
       // Créer un token JWT
       const token = jwt.sign({ id, role }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Connexion réussie.', token, user: { id, role } });
    });
  });
};
