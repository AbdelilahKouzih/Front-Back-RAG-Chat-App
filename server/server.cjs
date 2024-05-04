const express = require('express');
const app = express();
const cors = require('cors');
const chroma = require("chromadb");

app.use(cors());
app.use(express.json());

const pdfRoutes = require('./routes/pdfRoutes.cjs');
const chatRoutes = require('./routes/chatRoutes.cjs');



app.use('/api', chatRoutes);
app.use('/api', pdfRoutes); // Utilisez le fichier de routes pour les fichiers PDF


const port = 5000;
app.listen(port, () => {
    console.log(`server started on  ${port}`);
});
