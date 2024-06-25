const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Créez une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat-bot'
});

// Définissez la fonction de contrôleur pour supprimer tous les utilisateurs
exports.deleteAllUsers = (req, res) => {
  const sql = 'DELETE FROM users';

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de tous les utilisateurs dans la base de données :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de tous les utilisateurs.' });
      return;
    }

    res.json({ message: 'Tous les utilisateurs ont été supprimés avec succès.' });
  });
};

// Définissez la fonction de contrôleur pour ajouter un utilisateur
exports.addUser = (req, res) => {
  var { fullName, email, password,role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erreur lors du hachage du mot de passe :', err);
      res.status(500).json({ error: 'Erreur serveur lors de l\'inscription de l\'utilisateur.' });
      return;
    }

    const sql = 'INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)';
    if(role == null){
      role="user";
    }

    const values = [fullName, email, hashedPassword,role];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur dans la base de données :', err);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription de l\'utilisateur.' });
        return;
      }
      
      res.status(201).json({ message: 'Utilisateur ajouté avec succès.' });
    });
  });
};


exports.fetchUserDetails = (req, res) => {
  const userId = req.userId;

  const query = 'SELECT fullname, image FROM users WHERE id = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result[0]);
  });
};


// Définissez la fonction de contrôleur pour obtenir tous les utilisateurs
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users';
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs.' });
      return;
    }
    
    res.json(results);
  });
};

// Définissez la fonction de contrôleur pour mettre à jour un utilisateur
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { fullName, email, password,role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erreur lors du hachage du mot de passe :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur.' });
      return;
    }

    const sql = 'UPDATE users SET fullName = ?, email = ?, password = ?, role = ? WHERE id = ?';
    const values = [fullName, email, hashedPassword,role, id];
    
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur dans la base de données :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur.' });
        return;
      }
      
      res.json({ message: 'Utilisateur mis à jour avec succès.' });
    });
  });
};

// Définissez la fonction de contrôleur pour supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = ?';
  
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur dans la base de données :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur.' });
      return;
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès.' });
  });
};