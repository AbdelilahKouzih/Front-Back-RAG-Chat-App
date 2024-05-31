const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const chroma = require("chromadb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const openaiKey = 'sk-proj-sKVLGfhYqUxzP84s074ST3BlbkFJCQVAkZrBwgQWTwQsYRWf';
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: openaiKey });
const {OpenAIEmbeddingFunction} = require('chromadb');
const embedder = new OpenAIEmbeddingFunction({openai_api_key: openaiKey})
const publicPdfKey='project_public_9f2313869f625aeaa91542530ba3ec04_lHjM1ea925886a2caec5bd36fca1c005c5321';
const privatePdfKey='secret_key_157219d5d388ff82a84a68c746b3598c_MJp1A8ae2c4e29154da7412c9f32ad6817742';
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const instance = new ILovePDFApi(publicPdfKey, privatePdfKey);
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
const groqApi ='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';
let resresult = '';
const Groq = require('groq-sdk');
const groq = new Groq({
  apiKey: groqApi
});

//const chunkit = require('./chunkit.cjs');
async function importChunkit(text) {
  const { chunkit } = await import('semantic-chunking');

  let myTestChunks = await chunkit(
    text,
    {
        logging: true,
        maxTokenSize: 300,
        similarityThreshold: .577,             // higher value requires higher similarity to be included (less inclusive)
        dynamicThresholdLowerBound: .2,        // lower bound for dynamic threshold
        dynamicThresholdUpperBound: .9,        // upper bound for dynamic threshold
        numSimilaritySentencesLookahead: 3,
        combineChunks: true,
        combineChunksSimilarityThreshold: 0.3, // lower value will combine more chunks (more inclusive)
        onnxEmbeddingModel: "Xenova/all-MiniLM-L6-v2",
        onnxEmbeddingModelQuantized: true,
    }
); 
 return myTestChunks;
}

// Call the async function to import chunkit

const apiKey = "AIzaSyDGhKHN__SdqQsHC7xWY-APWxOcVkuG-N4";
const genAI = new GoogleGenerativeAI(apiKey);
const uploadDirectory = './uploads';

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
exports.uploadPDF = async (req, res) => {
  const { userInput, formData } = req.body;
  let chatHistory = [];  // Initialize it as an empty array

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
           // await convertToPDF(inputFilePath, outputFilePath);
            console.log(`Conversion réussie: ${inputFilePath} -> ${outputFilePath}`);
        } catch (error) {
            console.error(`Erreur lors de la conversion du fichier ${inputFilePath} en PDF:`, error);
        }
    }
});





  try {

    const cc = new chroma.ChromaClient({ path: "http://localhost:8080" });
    const fakeName =generateRandomString(5);
    const google = new chroma.GoogleGenerativeAiEmbeddingFunction({
      googleApiKey: apiKey,
    });
        
    const collection = await cc.createCollection({
      name: fakeName,
      embeddingFunction: google,
    });

    async function  getUploadsFiles() {
      let files = fs.readdirSync(uploadDirectory);
      if (files.length === 0) {
        console.log("Aucun fichier trouvé dans le répertoire. Attente de nouveaux fichiers...");
        return;
      }

      for (const file of files) {
        const filePath = path.join(uploadDirectory, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.size === 0) {
            console.error(`Le fichier ${file} est vide.`);
            continue;
          }
          const buffer = fs.readFileSync(filePath);
          const pdfExtract = new PDFExtract();
          const data = await new Promise((resolve, reject) => {
            pdfExtract.extractBuffer(buffer, {}, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
          let textContent = '';
          data.pages.forEach(page => {
            page.content.forEach(content => {
              if (content.str) {
                textContent += content.str + ' ';
              }
            });
          });
          const regexPattern = /(?<=\S)([.?!])\s+/g;
          const textChunks = chunkTextRegex(textContent,regexPattern);
          

          // start timing
          const startTime = performance.now();

         let  myTestChunks = await importChunkit(textContent);
          // end timeing
          const endTime = performance.now();

          // calculate tracked time in seconds
          let trackedTimeSeconds = (endTime - startTime) / 1000;
          trackedTimeSeconds =  parseFloat(trackedTimeSeconds.toFixed(2));

          console.log("result of chunking ====",myTestChunks);


          const formattedTexts = textChunks.filter(chunk => chunk !=='.');
          for (const formattedText of myTestChunks) {
            const documentId = generateRandomString(10);

            await collection.add({
              ids: [documentId],
              documents: [formattedText],
            });
          }
        } catch (error) {
          console.error(`Une erreur est survenue lors de la lecture du fichier ${file}:`, error);
        }
      }
    };

  

    const chunkTextRegex = (text, regexPattern) => {
      const chunks = text.split(regexPattern).filter(Boolean);
      return chunks;
    };


    await getUploadsFiles();
    const count = await collection.count();
    console.log("Nombre de documents ajoutés à la collection:", count);
  
    const googleQuery = new chroma.GoogleGenerativeAiEmbeddingFunction({
      googleApiKey: apiKey,
      taskType: "RETRIEVAL_QUERY",
    });

    const queryCollection = await cc.getCollection({
      name: fakeName,
      embeddingFunction: googleQuery,
    });

    console.log("============================================");
    const query = await queryCollection.query({
      queryTexts: [userInput],
      nResults: 1,
       
    });
     console.log("query", query);
     const documents = query.documents.flat();
      let textoContent = '';
      documents.forEach(document => {
          textoContent += document + '\n';
      });


    /*  const assistant = await openai.beta.assistants.create({
        name: "Chat-Bot AI",
        instructions:
            "Chat-Bot AI est votre nom et vous êtes un compagnon intelligent conçu pour fournir des informations et des services liés à l'entreprise. Vous devez présenter les différentes informations et services offerts par l'entreprise aux utilisateurs du site web, répondre à leurs questions et les guider selon leurs besoins. Vous devez répondre aux questions des utilisateurs selon la langue dans laquelle la question est posée et en fonction des données existantes qui sont téléchargées.",
        model: "gpt-3.5-turbo",
        tools: [{ type: "file_search" }],
    });*/
    
      //console.log("chromadb response : == ",textoContent);

      let prompt = ` Vous êtes un assistant avec le nom Chat-Bot AI pour les tâches de questions-réponses. Utilisez les éléments de contexte récupérés suivants pour répondre à la question . Si il n y a pas de contexte , repondre selon vos connaisances.tu dois repondre par la meme langue que la question , Question : ${userInput} Contexte : ${textoContent}`;
     /* 
      const chatCompletion = await groq.chat.completions.create({
        messages: [
        { role: 'system', content: 'Vous êtes un assistant avec le nom Chat-Bot AI pour les tâches de questions-réponses. Utilisez les éléments de contexte récupérés suivants pour répondre à la question . Si il n y a pas de contexte , repondre selon vos connaisances.tu dois repondre avec la langue de  utilisateur ' },
        { role: 'user', content: prompt }],
        model: 'mixtral-8x7b-32768',
      });
    
      console.log("Groooooooq",chatCompletion.choices[0].message.content);

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result2 = await model.generateContentStream([prompt]);

      const chat = model.startChat({
        history: [
          ...chatHistory.map(message => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
        ],
        generationConfig: {
          maxOutputTokens: 200,
        },
      });
  

      const msg = prompt;
      const result4 = await chat.sendMessage(msg);
      const response2 =  result4.response;
      const text = response2.text();

      chatHistory.push({ role: "user", text: msg });
      chatHistory.push({ role: "model", text: text });
      */
     // res.json({ text: chatCompletion.choices[0].message.content});

    console.log("=======================");
    console.log("response of open ai ================================= \n");
    async function main() {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
    
       console.log(completion.choices[0].message.content);
       res.json({ text: completion.choices[0].message.content });

    }
    
    main();


  } catch (error) {
    console.error("Erreur lors du chargement ou du traitement des fichiers PDF :", error);
    res.status(500).json({ error: "Une erreur est survenue lors du traitement des fichiers PDF" });
  }
};
