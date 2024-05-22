const { OpenAI } = require("openai");
const path = require('path');
const openaiKey = 'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';
const openai = new OpenAI({ apiKey: openaiKey });
const fs = require('fs');
const assistant_id = 'asst_I7zlg4wQnAV626vdY7u4aZcK';
const publicPdfKey='project_public_9f2313869f625aeaa91542530ba3ec04_lHjM1ea925886a2caec5bd36fca1c005c5321';
const privatePdfKey='secret_key_157219d5d388ff82a84a68c746b3598c_MJp1A8ae2c4e29154da7412c9f32ad6817742';
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const instance = new ILovePDFApi(publicPdfKey, privatePdfKey);
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const brigth_data_api ='cf76edb3-9e7a-493e-9dc3-26b96df83e0b';


// Variable pour stocker l'historique du chat
let chatHistory = [];

const chatController = {


    processChat: async (req, res) => {
        const { userInput } = req.body;
           // Cette fonction convertit un fichier en PDF
            const convertToPDF = async (inputFilePath, outputFilePath) => {
                try {
                    // Créer une nouvelle tâche iLovePDF pour convertir le fichier en PDF
                    const task = instance.newTask('officepdf');
                    await task.start();
                    const file = new ILovePDFFile(inputFilePath);
                    await task.addFile(file);
                    await task.process();
                    const pdfData = await task.download();
                    
                    // Écrire les données PDF dans le fichier de sortie
                    fs.writeFileSync(outputFilePath, pdfData);
                } catch (error) {
                    console.error("Erreur lors de la conversion en PDF :", error);
                    throw error;
                }
            };

            // Chemin vers le répertoire d'entrée (uploads) et de sortie (outputFiles)
            const inputDir = './uploads';
            const outputDir = './outputFiles';

            // Lire le contenu du répertoire d'entrée
            fs.readdir(inputDir, async (err, files) => {
                if (err) {
                    console.error('Erreur lors de la lecture du répertoire:', err);
                    return;
                }

                // Boucler sur chaque fichier dans le répertoire d'entrée
                for (const file of files) {
                    const inputFilePath = path.join(inputDir, file);
                    const outputFilePath = path.join(outputDir, path.parse(file).name + '.pdf');
                    
                    // Convertir le fichier en PDF
                    try {
                        await convertToPDF(inputFilePath, outputFilePath);
                        console.log(`Conversion réussie: ${inputFilePath} -> ${outputFilePath}`);
                    } catch (error) {
                        console.error(`Erreur lors de la conversion du fichier ${inputFilePath} en PDF:`, error);
                    }
                }
            });
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
             //convert office to pdf =====================================================

             //convert office to pdf 
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
                       // console.log(text.value);
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
