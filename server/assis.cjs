const express = require('express');
const { openai } = require("./assistant.cjs");
const { createAssistantIfNeeded } = require("./assistant.cjs");

// Setup Express
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Wrap the code block containing `await` inside an async function
async function startServer() {
  const assistant = await createAssistantIfNeeded();
  // Assistant can be created via API or UI
  //const assistantId = assistant.id;
  console.log(assistant);
  let pollingInterval;

  // Set up a Thread
  async function createThread() {
    console.log("Creating a new thread...");
    const thread = await openai.beta.threads.create();
    console.log(thread);
    return thread;
  }

  // Your remaining functions...
  async function addMessage(threadId, message) {
    console.log("Adding a new message to thread: " + threadId);
    const response = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: "antigone",
    });
    return response;
  }
  
  async function runAssistant(threadId) {
    console.log("Running assistant for thread: " + threadId);
    const response = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  
    console.log(response);
  
    return response;
  }
  
  async function checkingStatus(res, threadId, runId) {
    const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);
  
    const status = runObject.status;
    console.log(runObject);
    console.log("Current status: " + status);
  
    if (status == "completed") {
      clearInterval(pollingInterval);
  
      const messagesList = await openai.beta.threads.messages.list(threadId);
      let messages = [];
  
      messagesList.body.data.forEach((message) => {
        messages.push(message.content);
      });
  
      res.json({ messages });
    }
  }
 

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Call the async function to start the server
startServer();
