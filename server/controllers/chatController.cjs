const { OpenAI } = require("openai");
const path = require('path');
const openaiKey = 'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';
const openai = new OpenAI({ apiKey: openaiKey });
const fs = require('fs');
const assistant_id = 'asst_I7zlg4wQnAV626vdY7u4aZcK';
// Variable pour stocker l'historique du chat
let chatHistory = [];

const chatController = {
    processChat: async (req, res) => {
        const { userInput } = req.body;

      /*  const assistant = await openai.beta.assistants.create({
            name: "Chat-Bot AI",
            instructions:
              "Chat-Bot AI est votre nom et vous etes un compagnon légal intelligent, conçu pour aider et traiter différents types de documents tels que les PDF, les images ou les vidéos, et de répondre aux questions en se basant sur les données fournies dans ces documents. Vous devez répondre aux questions des utilisateurs selon la langue dans laquelle la question est posée",
            model: "gpt-3.5-turbo",
            tools: [{ type: "file_search" }],
          });*/

        try {
            // Créer les flux de fichiers pour chaque fichier dans 'uploads'
            const uploadDirectory = './uploads';
            const uploadFiles = await getUploadsFiles(uploadDirectory);
            const fileStreams = await createFileStreams(uploadFiles, uploadDirectory);

            // Effectuez le traitement avec votre chatbot
            const thread = await openai.beta.threads.create({
                messages: [
                    {
                        role: "user",
                        content: userInput,
                        attachments: fileStreams.map(fileStream => ({ file_id: fileStream.id, tools: [{ type: "file_search" }] })),
                    },
                ],
            });

            console.log("testing ai agent ==============================");
            // Le fil a maintenant un vecteur stocké dans ses ressources d'outil.
            console.log(thread.tool_resources?.file_search);
            
            const stream = openai.beta.threads.runs
                .stream(thread.id, {
                    assistant_id: assistant_id,
                })
                .on("textCreated", () => console.log("assistant >"))
                .on("toolCallCreated", (event) => console.log("assistant " + event.type))
                .on("messageDone", async (event) => {
                    if (event.content[0].type === "text") {
                        const { text } = event.content[0];
                        console.log(text.value);
                        // Envoyer la réponse de l'agent AI une fois qu'elle est prête
                        res.json({ text: text.value });
                    }
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const getUploadsFiles = (uploadDirectory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(uploadDirectory, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

const createFileStreams = async (uploadFiles, uploadDirectory) => {
    return await Promise.all(uploadFiles.map(async (fileName) => {
        return await openai.files.create({
            file: fs.createReadStream(path.join(uploadDirectory, fileName)),
            purpose: "assistants",
        });
    }));
};

module.exports = chatController;
