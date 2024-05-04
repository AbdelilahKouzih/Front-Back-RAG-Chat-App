const fs = require('fs');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const chroma = require("chromadb"); // Import du module chromadb
const { log } = require('console');

const apiKey = "AIzaSyDGhKHN__SdqQsHC7xWY-APWxOcVkuG-N4";

exports.uploadPDF = async (req, res) => {
  const pdfFile = req.file;

  try {
    const buffer = fs.readFileSync(pdfFile.path);
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

    // Afficher le contenu text extrait
    console.log(textContent);

      function cleanText(text) {
        // Supprimer les caractères spéciaux et les retours à la ligne
        const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, "");
        return cleanedText;
      }
      
      // Utilisation de la fonction cleanText pour nettoyer le texte extrait
     



    const cc = new chroma.ChromaClient({ path: "http://localhost:8080" });
    //await cc.reset();
       const collectionName = "test-pdf";

       const google = new chroma.GoogleGenerativeAiEmbeddingFunction({
        googleApiKey: apiKey,
      });
    /*
     const collection = await cc.createCollection({
        name: "rag-122-collection-pdf",
        embeddingFunction: google,
      });
      
      await collection.add({
        ids: ["id1"],
        documents: [textContent],
      });

      let count = await collection.count();
      console.log("count", count);
*/
      const googleQuery = new chroma.GoogleGenerativeAiEmbeddingFunction({
        googleApiKey:apiKey,
        taskType: "RETRIEVAL_QUERY",
      });
    
      const queryCollection = await cc.getCollection({
        name: "rag-122-collection-pdf",
        embeddingFunction: googleQuery,
      });
    
      console.log("============================================");
      const query = await queryCollection.query({
        queryTexts: ["abdelilah"],
        nResults: 2,
      });
      console.log("query", query);
    
    
/*
    cc.listCollections().then(existingCollections => {
    console.log(existingCollections);
    const collectionName = "test-pdf";
    if (existingCollections.includes(collectionName)) {
        cc.deleteCollection(collectionName);
        console.log(`La collection ${collectionName} a été supprimée.`);    
    } else {
      console.log(`La collection ${collectionName} n'existe pas.`);
    }
  });
    
    const google = new chroma.GoogleGenerativeAiEmbeddingFunction({
      googleApiKey: apiKey,
    });

    const collection = await cc.createCollection({
      name: "rag-7-collection-pdf",
      embeddingFunction: google,
    });
    
    const cleanedTextContent = cleanText(textContent);
    console.log(textContent);
   
      const response = await collection.add({
        ids: ["id1", "id2"],
        embeddings: [
          [1, 2, 3],
          [4, 5, 6],
        ],
        metadatas: [{ key: "value" }, { key: "value" }],
        documents: ["document1", "document2"],
      });
/*
    try {
      // Use try/catch for individual Chroma DB operations (optional)
      await collection.add({
        ids: ["doc1"],
        documents: [textContent], // Utilisation du texte extrait ici
      });
    } catch (error) {
      console.error("Error adding document to Chroma DB:", error);
      // Handle specific error scenarios (e.g., check error.status)
    }

    let count = collection.count();
    console.log("count", count);

    const googleQuery = new chroma.GoogleGenerativeAiEmbeddingFunction({
      googleApiKey: apiKey,
      taskType: "RETRIEVAL_QUERY",
    });

    const queryCollection = await cc.getCollection({
      name: "test-pdf",
      embeddingFunction: googleQuery,
    });

    const query = await collection.query({
      queryTexts: ["Antigone"],
      nResults: 1,
    });
    console.log("query", query);

    console.log("COMPLETED");

    const collections = await cc.listCollections();
    console.log("collections", collections);

    */res.status(200).json({ textContent });
  } catch (error) {
    console.error("Erreur lors du chargement du fichier PDF :", error);
    // Handle general errors here (e.g., PDF extraction errors)
    res.status(500).json({ error: "Une erreur est survenue lors du traitement du fichier PDF" });
  }
};
