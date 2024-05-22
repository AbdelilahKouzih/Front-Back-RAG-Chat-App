// Import necessary modules
const express = require('express');
const router = express.Router();
const { CheerioWebBaseLoader } = require('langchain/document_loaders/web/cheerio');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
const { RetrievalQAChain } = require('langchain/chains');

// Define your OpenAI API key
const openaiApiKey = 'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';

// Define the route handler function
const processSearch = async (req, res) => {
    try {
        // Extract userInput from request body
        const { userInput } = req.body;
        console.log("User input: ", userInput);

        // Regular expression to match URL
        const urlRegex = /(https?:\/\/[^\s]+)/;

        // Initialize url and query variables
        let url = '';
        let query = '';

        // Check if userInput contains a URL
        const urlMatch = userInput.match(urlRegex);
        if (urlMatch) {
            url = urlMatch[0]; // Extract the URL
            query = userInput.replace(url, '').trim(); // Remove URL from userInput and trim whitespace
        } else {
            // If no URL found, treat entire userInput as query
            query = userInput;
        }

        console.log("URL: ", url);
        console.log("Query: ", query);

        // Ensure query is a string
        if (typeof query !== 'string') {
            throw new Error("Query must be a string");
        }

        // Load documents from the URL if provided
        let splitsDocs = [];
        if (url) {
            const loader = new CheerioWebBaseLoader(url);
            const data = await loader.load();

            // Split documents into smaller chunks
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            splitsDocs = await textSplitter.splitDocuments(data);
        }

        // Initialize vector store
        const embedding = new OpenAIEmbeddings({ openAIApiKey: openaiApiKey });
        const vectorStore = await MemoryVectorStore.fromDocuments(
            splitsDocs,
            embedding
        );

        // Initialize the OpenAI model
        const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", apiKey: openaiApiKey });

        // Create the RetrievalQAChain
        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

        // Call the chain with the query
        const response = await chain.call({
            query: query, // Default query if none provided
        });

        console.log("Response: ", response);

        // Send the result back to the client
        res.json({ text: response.text });

    } catch (error) {
        // Handle any errors
        console.error("Error in processSearch:", error);
        res.status(500).json({ error: "An internal server error occurred" });
    }
};

// Export the router
module.exports.processSearch = processSearch;
