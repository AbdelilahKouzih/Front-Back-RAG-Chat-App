// Import required modules
const Microphone = require("node-microphone");
const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const FormData = require("form-data");
const Speaker = require("speaker");
const OpenAI = require("openai");
const wav = require("node-wav");
const elevenlabsKey ='6b76b6bdff7bcfacf63e9251f4292976';
// Variables to store chat history and other components
let chatHistory = []; // To store the conversation history
let mic, outputFile, micStream, rl; // Microphone, output file, microphone stream, and readline interface

console.log(
  `\n# # # # # # # # # # # # # # # # # # # # #\n# Welcome to your AI-powered voice chat #\n# # # # # # # # # # # # # # # # # # # # #\n`
);

// These are the main functions
// 1. setupReadlineInterface()
// 2. startRecording()
// 3. stopRecordingAndProcess()
// 4. transcribeAndChat()
// 5. streamedAudio()

// See diagram for overview of how they interact
// http://www.plantuml.com/plantuml/png/fPJ1ZjCm48RlVefHJY34Fi0Uq5QbYoeMKUqMxQKNaqnJ2tTisHEWF3sUD6jvJSCY4QbLFVdcZ-Vttzn4re67erMwPHVWIyIWV2gPrdXD34r47lmzwiuQmZKnXhrkyTNh1dI41xbPyI9uZwqBdQ7-YPDYpJcViGLrc-1QZ34tk4gNWwRO1lCL4xmyQ9x8RQxN-W7r4Rl5q1cNLOkQKkFkuUqxEF-uXZKPDjgQNmXvqXtTcSX8i7S1FkB91unHaME4OFe3Wzld_lScUgjFq6m4WfLe0Blp-F3WKNzBmpPAN2wVUsj2P2YQAlsHlvvaicd5_kL60hQfeyTG8d8d8rdZasbtz1WCespF3Um7lZKMdtXfg6VAebTNLurIrZaFkGPtQQaWNTfoKLvJ6ilresSmNTNqvToPcPc_V6Hc2nkSBroGPOPaaPb9QdHXHLrfGCcB3qM-KjiKKXW3bDa2gHgAnOu-867GZ23fJND4xoZYZCgpg2QXfQFl67ARd5krY-ST5oGsSen_xP6cbw8i8OP5hmqrempQYF2e3SjnxwTNoF-VTPNr3B-S-OpMsHVlBgIVyCVb0FpZFq5Wf4x9HqdwLp_FPYoyjwRLR1ofUIyMT9BN2dpc0mRO7ZHbUsQi4Vq_nEjtsKYfyN2M7EoRvVmMCZ0h8wFTfA_XQ7y3

// Function to set up the readline interface for user input
const setupReadlineInterface = () => {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true, // Make sure the terminal can capture keypress events
  });

  readline.emitKeypressEvents(process.stdin, rl);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  // Handle keypress events
  process.stdin.on("keypress", (str, key) => {
    if (
      key &&
      (key.name.toLowerCase() === "return" ||
        key.name.toLowerCase() === "enter")
    ) {
      if (micStream) {
        stopRecordingAndProcess();
      } else {
        startRecording();
      }
    } else if (key && key.ctrl && key.name === "c") {
      process.exit(); // Handle ctrl+c for exiting
    } else if (key) {
      console.log("Exiting application...");
      process.exit(0);
    }
  });

  console.log("Press Enter when you're ready to start speaking.");
};

// Function to start recording audio from the microphone
const startRecording = () => {
  mic = new Microphone();
  micStream = mic.startRecording();

  micStream.on("data", (data) => {
    // Write incoming data to a buffer
    outputFile.write(data);
  });

  micStream.on("close", () => {
    // Convert the recorded buffer to a WAV file
    const buffer = Buffer.concat(chunks);
    const wavData = wav.encode(buffer, {
      sampleRate: mic.sampleRate,
      float: false,
      bitDepth: 16,
      channels: 1,
    });
    fs.writeFileSync("output.wav", wavData);

    // Clear the buffer for the next recording
    chunks = [];
  });

  console.log("Recording... Press Enter to stop");
};

// Function to stop recording and process the audio
const stopRecordingAndProcess = () => {
  mic.stopRecording();
  console.log(`Recording stopped, processing audio...`);
  transcribeAndChat(); // Transcribe the audio and initiate chat
};

// Default voice setting for text-to-speech
const inputVoice = "echo"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

// Function to convert text to speech and play it using Speaker
async function streamedAudio(
  inputText,
  model = inputModel,
  voice = inputVoice
) {
  // Your code for converting text to speech using OpenAI and playing it with Speaker
}

// Function to transcribe audio to text and send it to the chatbot
async function transcribeAndChat() {
  const filePath = "output.wav";

  // Your code for transcribing audio to text and interacting with the chatbot
}

// Initialize the readline interface
setupReadlineInterface();
