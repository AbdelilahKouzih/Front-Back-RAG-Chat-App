const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Créez une connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat-bot'
});

// Définissez la fonction de contrôleur pour ajouter un utilisateur
exports.addUser = (req, res) => {
    // Extraire les données du corps de la demande
    const { fullName, email, password } = req.body;

    // Validez les données si nécessaire

    // Hasher le mot de passe
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe :', err);
            res.status(500).json({ error: 'Erreur serveur lors de l\'inscription de l\'utilisateur.' });
            return;
        }

        // Insérer l'utilisateur dans la base de données
        const sql = 'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)';
        const values = [fullName, email, hashedPassword];
        
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'enregistrement de l\'utilisateur dans la base de données :', err);
                res.status(500).json({ error: 'Erreur serveur lors de l\'inscription de l\'utilisateur.' });
                return;
            }
            
            // Répondre avec un message de succès
            res.status(201).json({ message: 'Utilisateur ajouté avec succès.' });
        });
    });
};
