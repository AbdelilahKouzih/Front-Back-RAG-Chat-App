const { OpenAI } = require("openai");
const fs = require('fs'); // Import the fs module

const apiKey = 'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';
const openai = new OpenAI({apiKey});

async function createAssistantIfNeeded() { // Wrap your code inside an async function
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Chat-Bot AI",
      instructions:
        "Chat-Bot AI is your intelligent legal companion, designed to assist you in navigating the complex world of laws and regulations effortlessly.",
      model: "gpt-3.5-turbo",
      tools: [{ type: "file_search" }],
    });

    
  // use files 
  const fileStreams = ["./test-rag.pdf"].map((path) =>
    fs.createReadStream(path),
  );
   
  // Create a vector store including our two files.
  let vectorStore = await openai.beta.vectorStores.create({
    name: "pdf-rag",
  });
   
  console.log("vectooooor",vectorStore);
  await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)

  await openai.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
  });

  // A user wants to attach a file to a specific message, let's upload it.
const aapl10k = await openai.files.create({
    file: fs.createReadStream("./data.txt"),
    purpose: "assistants",
  });
  
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content:
          " c'est quoi Antigone ?",
        // Attach the new file to the message.
        attachments: [{ file_id: aapl10k.id, tools: [{ type: "file_search" }] }],
      },
    ],
  });
  
  console.log("testing ai agent ==============================");
  // The thread now has a vector store in its tool resources.
  console.log(thread.tool_resources?.file_search);



    console.log("New assistant created:", assistant);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
  }

}

module.exports = { createAssistantIfNeeded };
