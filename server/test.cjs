const express = require('express');
const fs = require('fs');
const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');

const app = express();
const port = 3000;
const apikeygc="AIzaSyDMljRU_6bd5pdxaUPwTtmprTzodKgoUd4";
const project = 'chat-bot-rag';
const location = 'us-central1';
const textModel = 'gemini-1.0-pro';

const vertexAI = new VertexAI({ project: project, location: location });

const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
  generationConfig: { maxOutputTokens: 256 },
});

const input= "c'est quoi antigone ?";

app.get('/', (req, res) => {
  // Lire le contenu du fichier data.txt
  fs.readFile('data.txt', 'utf8', async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }

    try {
      // Utiliser le contenu lu comme entrée pour la fonction
      const metadata = await generateContentWithVertexAISearchGrounding(data);
      res.json(metadata);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("Error generating content");
    }
  });
});

async function generateContentWithVertexAISearchGrounding(data) {
  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: "definir antigone" }] }],
    tools: [{
      retrieval: {
        vertexAiSearch: {
          datastore: data,
        },
        disableAttribution: false,
      },
    }],
  });
  const response = result.response;
  const groundingMetadata = response.candidates[0].groundingMetadata;
  console.log("Grounding metadata is: ", JSON.stringify(groundingMetadata));
  return groundingMetadata;
}



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
