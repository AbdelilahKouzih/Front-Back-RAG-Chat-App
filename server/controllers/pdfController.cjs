const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const chroma = require("chromadb"); // Import du module chromadb
const { log } = require('console');
const { OpenAI } = require("openai");
const path = require('path');

const openaiKey = 'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';
const openai = new OpenAI({apiKey:openaiKey});
const apiKey = "AIzaSyDGhKHN__SdqQsHC7xWY-APWxOcVkuG-N4";

exports.uploadPDF = async (req, res) => {
  //const pdfFile = req.file;
  try {
  /*  const buffer = fs.readFileSync(pdfFile.path);
    const pdfExtract = new PDFExtract();

    // Use promise for extractBuffer
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
*/
/*

function chunkTextRegex(text, regexPattern) {
  const chunks = text.split(regexPattern).filter(Boolean);
  return chunks;
}


const regexPattern = /(?<=\S)([.?!])\s+/g;  // Exclude empty matches at start/end
const textChunks = chunkTextRegex(textContent, regexPattern);

//   const textChunks = chunkText(textContent, chunkSize, chunkOverlap);
   


   const textFormater = textChunks.filter(chunk => chunk !=='.');
   const documentIds = textFormater.map((document, index) => `id${index}`);

   // Ajouter les documents à la collection ChromaDB
   
  console.log("========chunks================");
  console.log(textFormater);
  console.log("========chunks================");

      function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const cc = new chroma.ChromaClient({ path: "http://localhost:8080" });
    //await cc.reset();
      const  fakeName =generateRandomString(5)
       const google = new chroma.GoogleGenerativeAiEmbeddingFunction({
        googleApiKey: apiKey,
      });
    
     const collection = await cc.createCollection({
        name: fakeName,
        embeddingFunction: google,
      });
      
      await collection.add({
        ids: documentIds,
        documents: textFormater,
      });

      let count = await collection.count();
      console.log("count===========", count);

      const googleQuery = new chroma.GoogleGenerativeAiEmbeddingFunction({
        googleApiKey:apiKey,
        taskType: "RETRIEVAL_QUERY",
      });

    
      const queryCollection = await cc.getCollection({
        name: fakeName,
        embeddingFunction: googleQuery,
      });

      console.log("============================================");
      const query = await queryCollection.query({
        queryTexts: [" Sophocle"],
        nResults: 2,
      });
      console.log("query", query);

 */   
    //ai agent ==================================================
    const assistant_id ='asst_xqRpZzbGDOSzJI2mUeC2bQ18';
      try {

        /*
        const assistant = await openai.beta.assistants.create({
          name: "Chat-Bot AI",
          instructions:
            "Chat-Bot AI is your intelligent legal companion, designed to assist you in navigating the complex world of laws and regulations effortlessly.",
          model: "gpt-3.5-turbo",
          tools: [{ type: "file_search" }],
        });
    */
        
      // use files 

      
const uploadDirectory = './uploads';

const getUploadsFiles = () => {
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

const uploadFiles = await getUploadsFiles();

// Créer les flux de fichiers pour chaque fichier dans 'uploads'
const fileStreams = await Promise.all(uploadFiles.map(async (fileName) => {
  return await openai.files.create({
    file: fs.createReadStream(path.join(uploadDirectory, fileName)),
    purpose: "assistants",
  });
}));

console.log("File Streams:", uploadFiles);

   /*   const fileStreams = await openai.files.create({
        file : fs.createReadStream('./abido.pdf'),
        purpose : "assistants",
      });*/

    
       
      // Create a vector store including our two files.
     /* let vectorStore = await openai.beta.vectorStores.create({
        name: "pdf-rag",
      });*/
   /*
      const vectorStore = await openai.beta.vectorStores.create({
        name: "pdf-rag",
        file_ids: [fileStreams]
      });
*/

var thread='';
  for (const fileStream of fileStreams) {
  // Mettez à jour l'assistant avec l'ID du fichier actuel
  await openai.beta.assistants.update(assistant_id, {
    file_ids: [fileStream.id],
  });



  console.log(fileStreams[0].id);

  // Créez le fil de discussion avec l'attachement du fichier actuel
    thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "donnez pour abdelilah des conseils !",
        attachments: [{ file_id: fileStreams[0].id, tools: [{ type: "file_search" }] }],
      },
    ],
  });
}      
      console.log("testing ai agent ==============================");
      // The thread now has a vector store in its tool resources.
      console.log(thread.tool_resources?.file_search);
    
      
      //thread =================================
       

  const stream = openai.beta.threads.runs
  .stream(thread.id, {
    assistant_id: assistant_id,
  })
  .on("textCreated", () => console.log("assistant >"))
  .on("toolCallCreated", (event) => console.log("assistant " + event.type))
  .on("messageDone", async (event) => {
    if (event.content[0].type === "text") {
      const { text } = event.content[0];
      const { annotations } = text;
      const citations = [];

      let index = 0;
      for (let annotation of annotations) {
        text.value = text.value.replace(annotation.text, "[" + index + "]");
        const { file_citation } = annotation;
        if (file_citation) {
          const citedFile = await openai.files.retrieve(file_citation.file_id);
          citations.push("[" + index + "]" + citedFile.filename);
        }
        index++;
      }

      console.log(text.value);
      console.log(citations.join("\n"));
    }
  });


    
       // return assistant;
      } catch (error) {
        console.error("Error creating assistant:", error);
      }
    //ai agent ==================================================

     res.status(200).json({});
  } catch (error) {
    console.error("Erreur lors du chargement du fichier PDF :", error);
    res.status(500).json({ error: "Une erreur est survenue lors du traitement du fichier PDF" });
  }
};
