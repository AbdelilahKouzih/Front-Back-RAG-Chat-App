import React, { useState } from 'react';
import { BsFileEarmarkArrowUp, BsPlayFill } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi'; // Importer l'icône de copie
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import userSix from '../../images/user/Graident-Ai-Robot-1.png';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';

const ECommerce: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async () => {
        if (!userInput) return;

        try {
            setLoading(true);

            // Check if the user input contains a URL
            const urlRegex = /(https?:\/\/[^\s]+)/;
            if (urlRegex.test(userInput)) {
                // If the user input contains a URL, launch the searchController
                const response = await axios.post('http://localhost:5000/api/search', { userInput });
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { role: "user", text: userInput },
                    { role: "model", text: response.data.text },
                ]);
            } else {
                // If the user input does not contain a URL, launch the chatController
                const response = await axios.post('http://localhost:5000/api/chat', { userInput });
                setChatHistory(prevHistory => [
                    ...prevHistory,
                    { role: "user", text: userInput },
                    { role: "model", text: response.data.text },
                ]);


                axios.post('http://localhost:5000/api/upload-pdf', {
                    userInput: userInput
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors du téléversement :", error);
                });
            }

            setUserInput('');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setChatHistory(prevHistory => [
                ...prevHistory,
                { role: "user", text: 'Oops! Something went wrong. Try again later.' },
            ]);
            setLoading(false);
        }
    };


    const handleFileChange2 = (event) => {
        //handleFileChange(event);
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('pdfFiles', file);
            });

            axios.post('http://localhost:5000/api/upload1-pdf', formData)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Erreur lors du téléversement :", error);
                });
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append('pdfFiles', file);
            });
            console.log(formData);
            
            axios.post('http://localhost:5000/api/upload-pdf', {
                userInput: userInput,
                formData: formData
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors du téléversement :", error);
            });
        
        }
    };

    return (
        <DefaultLayout>
            <div className="h-full flex flex-col  ">
                <div className="flex-1 ">
                    <div className="bg-gray-100  p-6 rounded-lg shadow text-center">
                        {/* Affichage de l'indicateur de chargement */}
                       
                        <div className="mb-4 flex flex-col items-center justify-center">
                            <img src={userSix} className='rounded-full w-40 h-40' />
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">Comment puis-je vous aider ?</h4>
                        </div>
                        <div>
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`relative p-4 rounded-lg shadow ${message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-700'}`}>
                                    <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
                                    {message.role === 'model' && (
                                        <button
                                            className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            onClick={() => {
                                                // Copier le contenu du message
                                                navigator.clipboard.writeText(message.text);
                                            }}
                                            >
                    <FiCopy className="w-4 h-4 text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out" />
                    </button>
                )}
            </div>
        </div>
    ))}
    {loading && (
        <div className="flex items-center h-[5vh] text-gray-900 dark:text-gray-100 dark:bg-gray-950">
            <div>
                <h1 className="text-sm md:text-xl font-bold flex">
                    L
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        className="animate-spin"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12L19.997 11.81L18.7055 10.8719ZM12 9.536L9.656 11.238L10.552 14H13.447L14.343 11.238L12 9.536ZM14.2914 4.33299L12.9995 5.27293V7.78993L15.6935 9.74693L17.9325 9.01993L18.4867 7.3168C17.467 5.90685 15.9988 4.84254 14.2914 4.33299ZM9.70757 4.33329C8.00021 4.84307 6.53216 5.90762 5.51261 7.31778L6.06653 9.01993L8.30554 9.74693L10.9995 7.78993V5.27293L9.70757 4.33329Z"></path>
                    </svg>
                    ading . . .
                </h1>
            </div>
        </div>
    )}
</div>
                    </div>
                </div>
                <div className="  w-9/12 bg-gray-100 p-6 rounded-b-lg shadow flex items-center fixed bottom-0  ">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={(event) => event.key === 'Enter' && handleSubmit() && setUserInput('')}
                        className="flex-1 p-4 rounded-lg border border-gray-300 focus:outline-none  "
                    />
                    <button onClick={handleSubmit} className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none">
                        <BsPlayFill className="text-2xl" />
                    </button>
                    <label htmlFor="file-upload" className="p-4 bg-slate-500 text-white rounded-lg ml-4 hover:bg-slate-400 focus:outline-none">
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

export default ECommerce;
