import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { BsFileEarmarkArrowUp, BsPlayFill } from 'react-icons/bs';
import DefaultLayout from '../../layout/DefaultLayout';

const OPENAI_API_KEY =
  'sk-proj-DpYl8J9hbphjvSgnNLRbT3BlbkFJRPNeuldMdAGbUwICBQn8';
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/speech';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechRecognizer, setSpeechRecognizer] =
    useState<SpeechRecognition | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>('alloy'); // Défaut: 'alloy'
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const voices = [
    { name: 'Alloy', voice_id: 'alloy' },
    { name: 'Echo', voice_id: 'echo' },
    { name: 'Fable', voice_id: 'fable' },
    { name: 'Onyx', voice_id: 'onyx' },
    { name: 'Nova', voice_id: 'nova' },
    { name: 'Shimmer', voice_id: 'shimmer' },
  ];
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognizer = new (window.SpeechRecognition ||
        (window as any).webkitSpeechRecognition)();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'fr-FR';
      recognizer.onresult = handleSpeechResult;
      setSpeechRecognizer(recognizer);
    }
  }, []);

  const handleSpeechResult = (event: SpeechRecognitionResult) => {
    let interimTranscripts = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        setUserInput(transcript);
        handleSubmit(transcript);
      } else {
        interimTranscripts += transcript;
      }
    }
  };

  const handleStartChat = () => {
    if (speechRecognizer) {
      setIsListening(true);
      speechRecognizer.start();
    }
  };

  const handleStopChat = () => {
    if (speechRecognizer) {
      setIsListening(false);
      speechRecognizer.stop();
    }
  };
  const generateSpeech = async (text: string, selectedVoice: string) => {
    if (!text) return;

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'tts-1',
          voice: selectedVoice, // Utilisation de la voix sélectionnée ici
          input: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          responseType: 'arraybuffer',
        },
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (input: string) => {
    if (!input) return;
    setUserInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        userInput: input,
      });

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', text: input },
        { role: 'model', text: response.data.text },
      ]);

      await generateSpeech(response.data.text, selectedVoice);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', text: input },
        { role: 'model', text: 'Oops! Something went wrong. Try again later.' },
      ]);
    }
  };


  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    //handleFileChange(event);
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('pdfFiles', file);
      });

      axios
        .post('http://localhost:5000/api/upload1-pdf', formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors du téléversement :', error);
        });
    }
  };

  return (
    <DefaultLayout>
      <div className="w-screen h-screen flex flex-col">
        {loading && (
          <div className="loader absolute flex items-center justify-center top-[12vw] left-[33vw] ">
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
          </div>
        )}
        <div className="fixed bg-opacity-40 border border-white-500 bg-slate-600 rounded-lg top-1/2 left-[58vw] transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-full flex items-center justify-center mb-6">
                <div className="container-btn flex justify-center items-center h-screen">
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={isListening}
                    onChange={() =>
                      isListening ? handleStopChat() : handleStartChat()
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="checkbox"
                    className={`button flex items-center justify-center w-12 h-12 rounded-full ${
                      isListening ? 'bg-blue-600' : 'bg-gray-400'
                    } cursor-pointer transition-all duration-300`}
                  >
                    <FontAwesomeIcon
                      icon={isListening ? faMicrophoneSlash : faMicrophone}
                      className="text-white w-8 h-8"
                    />
                  </label>
                </div>
              </div>
              <div className="relative group rounded-lg w-64 bg-gray-50 overflow-hidden before:absolute before:w-12 before:h-12  ">
                <svg
                  y="0"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  width="100"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  height="100"
                  className="w-8 h-8 absolute right-0 -rotate-45 stroke-pink-300 top-1.5 group-hover:rotate-0 duration-300"
                >
                  <path
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                    d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                    className="svg-stroke-primary"
                  ></path>
                </svg>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="appearance-none  relative text-slate-400 bg-transparent ring-0 outline-none border border-white-500 text-neutral-900 text-sm font-bold rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5"
                >
                  {voices.map((voice) => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-9/12 bg-gray-100 p-6 rounded-b-lg shadow flex items-center fixed bottom-0">
          <input
            type="text"
            placeholder="Tapez votre question ici..."
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={async (event) => {
              if (event.key === 'Enter') {
                await handleSubmit(userInput);
                setUserInput('');
              }
            }}
            className="flex-1 p-4 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => handleSubmit(userInput)}
            className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none"
          >
            <BsPlayFill className="text-2xl" />
          </button>
          <label
            htmlFor="file-upload"
            className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none"
          >
            <BsFileEarmarkArrowUp className="text-2xl" />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange2}
          />

        </div>
      </div>
    </DefaultLayout>
  );
};

export default Chat;
