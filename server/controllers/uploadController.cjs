const { OpenAI } = require("openai");
const path = require("path");
const openaiKey = "sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8";
const openai = new OpenAI({ apiKey: openaiKey });
const fs = require("fs");
const mysql = require("mysql");
const mammoth = require("mammoth"); // For converting DOCX to text
const pdfParse = require("pdf-parse"); // For parsing PDF content
const PDFDocument = require("pdfkit"); // For generating PDFs
const assistant_id = 'asst_I7zlg4wQnAV626vdY7u4aZcK';

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat-bot",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

const extractTextFromDocx = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const extractTextFromPdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

const extractTextFromFile = async (file) => {
  const extension = path.extname(file.filename).toLowerCase();
  const buffer = Buffer.from(file.file_data);

  switch (extension) {
    case ".docx":
      return await extractTextFromDocx(buffer);
    case ".pdf":
      return await extractTextFromPdf(buffer);
    case ".txt":
      return buffer.toString("utf-8");
    default:
      throw new Error(`Unsupported file extension: ${extension}`);
  }
};

const cleanText = (text) => {
  return text
    .replace(/[/:{}=\[\]\\]/g, "") // Remove unwanted characters
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
};

const createPDF = (text, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc.text(text);
    doc.end();

    writeStream.on("finish", () => {
      resolve();
    });

    writeStream.on("error", (error) => {
      reject(error);
    });
  });
};

const uploadFileToOpenAI = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  const file = await openai.files.create({
    file: fileStream,
    purpose: "assistants",
  });
  return file.id;
};

const chatController = {
  processChat: async (req, res) => {
    const { userInput } = req.body;

    try {
      // Ensure the temporary directory exists
      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Fetch files from the database
      connection.query("SELECT * FROM files", async (err, results) => {
        if (err) {
          console.error("Error fetching data from database:", err);
          res.status(500).json({ error: "Database Error" });
          return;
        }

        // Extract text content from each file, clean it, and create a PDF
        const pdfFiles = await Promise.all(
          results.map(async (file) => {
            try {
              const content = await extractTextFromFile(file);
              const cleanedContent = cleanText(content);
              const tempFilePath = path.join(
                tempDir,
                `${path.parse(file.filename).name}.pdf`
              );
              await createPDF(cleanedContent, tempFilePath);
              const fileId = await uploadFileToOpenAI(tempFilePath);
              return { filename: file.filename, pdfPath: tempFilePath, fileId };
            } catch (error) {
              console.error(`Error processing file ${file.filename}:`, error);
              return {
                filename: file.filename,
                pdfPath: null,
                fileId: null,
                error: "Error processing file",
              };
            }
          })
        );

        // Continue with the chat processing
        const thread = await openai.beta.threads.create({
          messages: [
            {
              role: "user",
              content: userInput,
              attachments: pdfFiles.map((file) => ({
                file_id: file.fileId,
                tools: [{ type: "file_search" }],
              })),
            },
          ],
        });

        console.log("testing ai agent ==============================");
        // Le fil a maintenant un vecteur stocké dans ses ressources d'outil.
        console.log(thread.tool_resources?.file_search);

        const stream = openai.beta.threads.runs
          .stream(thread.id, {
            assistant_id: assistant_id,
          })
          .on("textCreated", () => console.log("assistant >"))
          .on("toolCallCreated", (event) =>
            console.log("assistant " + event.type)
          )
          .on("messageDone", async (event) => {
            if (event.content[0].type === "text") {
              const { text } = event.content[0];
              // console.log(text.value);
              // Envoyer la réponse de l'agent AI une fois qu'elle est prête
              res.json({ text: text.value });
            }
          });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = chatController;
