const path = require('path');
const fs = require('fs');
const { OpenAI } = require("openai");
const openaiKey = 'sk-proj-sKVLGfhYqUxzP84s074ST3BlbkFJCQVAkZrBwgQWTwQsYRWf';
const openai = new OpenAI({ apiKey: openaiKey });
const publicPdfKey='project_public_9f2313869f625aeaa91542530ba3ec04_lHjM1ea925886a2caec5bd36fca1c005c5321';
const privatePdfKey='secret_key_157219d5d388ff82a84a68c746b3598c_MJp1A8ae2c4e29154da7412c9f32ad6817742';
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const instance = new ILovePDFApi(publicPdfKey, privatePdfKey);
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const brigth_data_api ='cf76edb3-9e7a-493e-9dc3-26b96df83e0b';
const mysql = require("mysql");
const mammoth = require("mammoth"); // For converting DOCX to text
const pdfParse = require("pdf-parse"); // For parsing PDF content
const PDFDocument = require("pdfkit"); // For generating PDFs
const uploadDirectory = path.join(__dirname, '../chatBotFiles');
const assistant_id='asst_lYYGaAdZh5PJ0h8DU7D8cZFG';
// Create a MySQL database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chat-bot",
  });
  // Connect to the database
connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
  });

  
const extractTextFromDocx = async (buffer) => {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  };
  
  const extractTextFromPdf = async (buffer) => {
    const data = await pdfParse(buffer);
    return data.text;
  };
  
  const extractTextFromFile = async (file) => {
    const extension = path.extname(file.filename).toLowerCase();
    const buffer = Buffer.from(file.file_data);
  
    switch (extension) {
      case ".docx":
        return await extractTextFromDocx(buffer);
      case ".pdf":
        return await extractTextFromPdf(buffer);
      case ".txt":
        return buffer.toString("utf-8");
      default:
        throw new Error(`Unsupported file extension: ${extension}`);
    }
  };
  
  const cleanText = (text) => {
    return text
      .replace(/[/:{}=\[\]\\]/g, "") // Remove unwanted characters
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim(); // Trim leading and trailing spaces
  };
  
  const createPDF = (text, outputPath) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(outputPath);
  
      doc.pipe(writeStream);
      doc.text(text);
      doc.end();
  
      writeStream.on("finish", () => {
        resolve();
      });
  
      writeStream.on("error", (error) => {
        reject(error);
      });
    });
  };
  
  const uploadFileToOpenAI = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const file = await openai.files.create({
      file: fileStream,
      purpose: "assistants",
    });
    return file.id;
  };

const processChat = async (req, res) => {
    const { userInput } = req.body;


     // Ensure the temporary directory exists
     const tempDir = path.join(__dirname, "chatBotFilestemp");
     if (!fs.existsSync(tempDir)) {
       fs.mkdirSync(tempDir, { recursive: true });
     }

      /* // Cette fonction convertit un fichier en PDF
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
        const inputDir = '../chatBotFiles';
        const outputDir = '../chatBotFiles';

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

*/


    /*  const assistant = await openai.beta.assistants.create({
        name: "Chat-Bot AI",
        instructions:
            "Chat-Bot AI est votre nom et vous êtes un compagnon intelligent conçu pour fournir des informations et des services liés à l'entreprise. Vous devez présenter les différentes informations et services offerts par l'entreprise aux utilisateurs du site web, répondre à leurs questions et les guider selon leurs besoins. Vous devez répondre aux questions des utilisateurs selon la langue dans laquelle la question est posée et en fonction des données existantes qui sont téléchargées.",
        model: "gpt-3.5-turbo",
        tools: [{ type: "file_search" }],
    });*/

    try {
        // Créer les flux de fichiers pour chaque fichier dans 'uploads'

       // const uploadFiles = await getUploadsFiles(uploadDirectory);
       // const fileStreams = await createFileStreams(uploadFiles, uploadDirectory);
         //convert office to pdf =====================================================

         //convert office to pdf 
        // Effectuez le traitement avec votre chatbot
    //=======================================================================================================
    connection.query(" SELECT files.* FROM files JOIN users ON files.user_id = users.id WHERE users.role = 'admin' ", async (err, results) => {
        if (err) {
          console.error("Error fetching data from database:", err);
          res.status(500).json({ error: "Database Error" });
          return;
        }

        // Extract text content from each file, clean it, and create a PDF
        const pdfFiles = await Promise.all(
          results.map(async (file) => {
            try {
              const content = await extractTextFromFile(file);
              const cleanedContent = cleanText(content);
              const tempFilePath = path.join(
                tempDir,
                `${path.parse(file.filename).name}.pdf`
              );
              await createPDF(cleanedContent, tempFilePath);
              const fileId = await uploadFileToOpenAI(tempFilePath);
              return { filename: file.filename, pdfPath: tempFilePath, fileId };
            } catch (error) {
              console.error(`Error processing file ${file.filename}:`, error);
              return {
                filename: file.filename,
                pdfPath: null,
                fileId: null,
                error: "Error processing file",
              };
            }
          })
        );

        // Continue with the chat processing
        const thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content: userInput,
              attachments: pdfFiles.map((file) => ({
                file_id: file.fileId,
                tools: [{ type: "file_search" }],
              })),
            },
          ],
        });

        console.log("testing ai agent ==============================");

        const stream = openai.beta.threads.runs
          .stream(thread.id, {
            assistant_id: assistant_id,
          })
          .on("textCreated", () => console.log("assistant >"))
          .on("toolCallCreated", (event) =>
            console.log("assistant " + event.type)
          )
          .on("messageDone", async (event) => {
            if (event.content[0].type === "text") {
              const { text } = event.content[0];
              // console.log(text.value);
              // Envoyer la réponse de l'agent AI une fois qu'elle est prête
              res.json({ text: text.value });
            }
          });
      });
    //=======================================================================================================
/*

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
                assistant_id: assistant.id,
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
            });*/
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

const uploadFile = (req, res) => {
  res.status(200).json({ message: 'Fichier téléchargé avec succès' });
};

const getFiles = (req, res) => {
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.error('Erreur lors de la récupération des fichiers :', err);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des fichiers' });
      return;
    }
    res.json({ files });
  });
};

const deleteFile = (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(uploadDirectory, fileName);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).json({ error: 'Le fichier spécifié n\'existe pas.' });
      return;
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du fichier :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du fichier.' });
        return;
      }
      res.json({ message: 'Le fichier a été supprimé avec succès.' });
    });
  });
};



module.exports = {
  processChat,
  uploadFile,
  getFiles,
  deleteFile,
};
