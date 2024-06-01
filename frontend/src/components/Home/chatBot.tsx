import React, { useState, useEffect } from 'react';
import {
  AiOutlineUser,
  AiOutlineRobot,
  AiOutlineReload,
  AiOutlineClose,
} from 'react-icons/ai';
import LogoIcon from '../../images/logo/Graident-Ai-Robot-1.png';
import axios from 'axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import userSix from '../../images/user/Graident-Ai-Robot-1.png';
import 'animate.css'; // Import animate.css

const ChatBot: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; text: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUserInput('');
    if (!userInput) return;
    try {
      setLoading(true);

      const urlRegex = /(https?:\/\/[^\s]+)/;
      const response = urlRegex.test(userInput)
        ? await axios.post('http://localhost:5000/api/search', { userInput })
        : await axios.post('http://localhost:5000/api/chatbot', { userInput });

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', text: userInput },
        { role: 'model', text: response.data.text },
      ]);

      setUserInput('');
      setLoading(false);
    } catch (error) {
      console.error('Error while sending message:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', text: userInput },
        { role: 'model', text: 'Oops! Something went wrong. Try again later.' },
      ]);
      setLoading(false);
    }
  };

  const toggleChatBot = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeChatBot = () => {
    setIsOpen(false);
    setChatHistory([]);
  };
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      setChatHistory([
        { role: 'model', text: 'Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?' }
      ]);
    }
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [isOpen, chatHistory.length]);
  

  return (
    <>
      <button
        className="fixed bottom-7 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black text-white transition duration-300 ease-in-out transform hover:bg-gray-700 hover:text-gray-300 hover:border-gray-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={toggleChatBot}
      >
        <img src={LogoIcon} alt="Logo" className="w-12 h-auto" />
      </button>

      {isOpen && (
        <div
          style={{
            boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)',
            position: 'fixed',
            bottom: 'calc(4rem + 1.5rem)',
            right: '0',
            marginRight: '4px',
            zIndex: 9999,
          }}
        >
          
          <div className=" animate__animated animate__fadeIn animate__faster fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 mb-4 bg-white rounded-lg border border-[#e5e7eb] w-[380px] h-[530px] flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center rounded-t-lg">
              <div className="flex items-center space-x-2">
                <h2 className="font-semibold text-lg">Chatbot</h2>
              </div>
             
              <div className="flex space-x-2">
                
                <AiOutlineReload
                  className="cursor-pointer w-6 h-6"
                  onClick={() => setChatHistory([])}
                />
                <AiOutlineClose
                  className="cursor-pointer w-6 h-6"
                  onClick={closeChatBot}
                />
              </div>
            </div>

            <div id="chat-container" className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex flex-col items-center justify-center">
              <img src={userSix} className="rounded-full w-20 h-20" />

            </div>
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <div className="bg-slate-500 p-2 m-2 rounded-full">
                          <AiOutlineUser className="w-6  h-6 text-white" />
                        </div>
                      ) : (
                        <div className="bg-slate-500 p-2 rounded-full">
                          <AiOutlineRobot className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`relative p-4 rounded-lg shadow ${
                        message.role === 'user'
                          ? 'bg-slate-400 text-white'
                          : 'bg-gray-200 text-slate-700'
                      }`}
                    >
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center justify-center text-gray-900 dark:text-gray-100 dark:bg-gray-950">
                  <div className="flex items-center space-x-1">
                    <h1 className="text-sm md:text-xl font-semibold">L</h1>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="animate-spin h-5 w-5"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
                    </svg>
                    <h1 className="text-sm md:text-xl font-semibold">
                      ading . . .
                    </h1>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex-shrink-0 bg-gray-100 p-4 rounded-b-lg">
              <form
                className="flex items-center w-full space-x-2"
                onSubmit={handleSubmit}
              >
                <input
                  className="flex h-10 w-full font-semibold rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-white focus-visible:ring-offset-2"
                  placeholder="Type your message"
                  value={userInput}
                  onChange={handleInputChange}
                />
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-semibold text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-slate-900 hover:bg-slate-700 h-10 px-4 py-2"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
