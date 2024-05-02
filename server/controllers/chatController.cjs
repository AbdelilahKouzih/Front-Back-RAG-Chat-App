const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDGhKHN__SdqQsHC7xWY-APWxOcVkuG-N4';
const genAI = new GoogleGenerativeAI(apiKey);

// Variable pour stocker l'historique du chat
let chatHistory = [];

const chatController = {
    processChat: async (req, res) => {
        const { userInput } = req.body;

        try {
            // Effectuez le traitement avec votre chatbot
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chat = model.startChat({
                history: chatHistory.map(message => ({
                    role: message.role,
                    parts: [{ text: message.text }],
                })),
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });

            const result = await chat.sendMessage(userInput);
            const response = await result.response.text();

            // Stockez le message dans l'historique du chat
            chatHistory.push({ role: "user", text: userInput });
            chatHistory.push({ role: "model", text: response });

            res.json({ text: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = chatController;
