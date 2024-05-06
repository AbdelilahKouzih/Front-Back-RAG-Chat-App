const express = require('express');
const fs = require('fs');
const {
  FunctionDeclarationSchemaType,
  HarmBlockThreshold,
  HarmCategory,
  VertexAI
} = require('@google-cloud/vertexai');
const openaikey="sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8";
const app = express();
const port = 3000;
const apikeygc="AIzaSyDMljRU_6bd5pdxaUPwTtmprTzodKgoUd4";
const project = 'chat-bot-rag';
const location = 'us-central1';
const textModel = 'gemini-pro';

const vertexAI = new VertexAI({
  project: project,
  location: location
});
const generativeModel = vertexAI.getGenerativeModel({
  model: textModel,
  safetySettings: [{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }],
  generationConfig: { maxOutputTokens: 256 },
});

const input= "antigone";
const data1 = [
  {
    "content": "Antigone is a tragedy by Sophocles written in or before 441 BCE. It is the third of the three Theban plays chronologically, but was the first to be written.",
    "title": "Antigone - Wikipedia",
    "metadata": {
      "source": "Wikipedia",
      "topic": "Greek Tragedy"
    }
  },
  {
    "content": "Antigone, in Greek legend, the daughter of Oedipus, king of Thebes, by his mother, Jocasta. She is known for her unwavering devotion to family and divine law.",
    "title": "Antigone - Britannica",
    "metadata": {
      "source": "Britannica",
      "topic": "Greek Mythology"
    }
  }
 
];
app.get('/', (req, res) => {
  // Lire le contenu du fichier data.txt
  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading file");
      return;
    }

    try {
      // Utiliser le contenu lu comme entrée pour la fonction
      res.json(metadata);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("Error generating content");
    }
  });
});

const metadata = await generateContentWithVertexAISearchGrounding(data);

async function generateContentWithVertexAISearchGrounding(data) {
  const result = await generativeModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: 'Antigone ?' }] }],
    tools: [{
      retrieval: {
        vertexAiSearch: {
          datastore: 'C:\Users\HP\Desktop\Front-Back-RAG-Chat-App\server\data.txt',
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
