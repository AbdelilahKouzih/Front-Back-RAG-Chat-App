const mysql = require('mysql2/promise'); // Utilisation de mysql2 pour les promesses

// Créer une connexion à la base de données
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat-bot",
});

// Ajouter un historique de chat
const addChatHistory = async (req, res) => {
    const { userId, chatContent } = req.body;
    try {
      const chatContentJson = JSON.stringify(chatContent); // Convertir en JSON
      const [result] = await pool.query('INSERT INTO chat_history (user_id, chat_content) VALUES (?, ?)', [userId, chatContentJson]);
      res.status(200).json({ message: 'Chat history added successfully' });
    } catch (error) {
      console.error("Error adding chat history:", error);
      res.status(500).json({ error: 'Error adding chat history' });
    }
  };
  

// Récupérer l'historique des chats pour un utilisateur
const getChatHistory = async (req, res) => {
    const { userId } = req.params;
    try {
      const [rows] = await pool.query('SELECT id, chat_content FROM chat_history WHERE user_id = ?', [userId]);
      
      const chatHistories = rows.map(row => {
        const chatContent = JSON.parse(row.chat_content);
        const firstUserQuestion = chatContent.find(message => message.role === 'user');
        return {
          id: row.id,
          firstQuestion: firstUserQuestion ? firstUserQuestion.text : 'No questions found'
        };
      });
      res.status(200).json({ chatHistories });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: 'Error fetching chat history' });
    }
  };
  

const getChatHistoryByid = async (req, res) => {
    const { chatId } = req.params;
    try {
      const [rows] = await pool.query('SELECT chat_content FROM chat_history WHERE id = ?', [chatId]);
      if (rows.length > 0) {
        res.status(200).json({ chatHistory: JSON.parse(rows[0].chat_content) });
      } else {
        res.status(404).json({ error: 'Chat history not found' });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: 'Error fetching chat history' });
    }
  };

  const deleteChatHistory = async (req, res) => {
    const { chatId } = req.params;
    try {
      await pool.query('DELETE FROM chat_history WHERE id = ?', [chatId]);
      res.status(200).json({ message: 'Chat history deleted successfully' });
    } catch (error) {
      console.error("Error deleting chat history:", error);
      res.status(500).json({ error: 'Error deleting chat history' });
    }
  };

module.exports = { addChatHistory, getChatHistory, getChatHistoryByid ,deleteChatHistory};
