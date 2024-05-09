// Import necessary modules
const express = require('express');
const router = express.Router();
const { RAGApplicationBuilder, WebLoader } = require('@llmembed/embedjs');
const { ChromaDb } = require('@llm-tools/embedjs/vectorDb/chroma');

// Define the route handler function
const processSearch = async (req, res) => {
    try {
        // Extract userInput from request body
        const { userInput } = req.body;

        console.log("user input : =================>",userInput);

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

        console.log("url : ===========",url);
        console.log("query : ===========",query);

        // Create the ragApplication instance with url as the URL
        const ragApplication = await new RAGApplicationBuilder()
            .addLoader(new WebLoader({ url })) // Use url as URL
            .setVectorDb(new ChromaDb({ url: 'http://localhost:8080' }))
            .build();

        // Perform the query using query
        const response = await ragApplication.query(query);
        console.log(response.result);
        // Send the result back to the client
        res.json({ text:response.result});
        
    } catch (error) {
        // Handle any errors
        console.error("Error in searchController:", error);
        res.status(500).json({ error: "An internal server error occurred" });
    }
};

// Export the router
module.exports.processSearch = processSearch;
