import React, { useState, useEffect,useContext } from 'react';
import DefaultLayoutAdmin from '../../layout/DefaultLayoutAdmin';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../components/UserContext'; // Importez le contexte

const ChatbotFiles = () => {
  const { user } = useContext(UserContext)!; // Utilisez le contexte
  const token = localStorage.getItem('token'); // Récupérer le token JWT du stockage local

  const userId = user?.id; 
  const location = useLocation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileList, setFileList] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const uploadFile = async () => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('pdfFiles', file));
    formData.append('userId', userId ? userId.toString() : '');
    try {
      const response = await fetch('http://localhost:5000/api/upload1-pdf', {
        headers: {
          'Authorization': `Bearer ${token}`, // Ajouter le token JWT à l'en-tête
        },
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      setSelectedFiles([]);
      fetchFiles();
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/files?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajouter le token JWT à l'en-tête
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fichiers');
      }

      const data = await response.json();
      setFileList(data.files);
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
    }
  };

  const deleteFile = async (fileName: string, userId:number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/files/${fileName}/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Ajouter le token JWT à l'en-tête
          },
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du fichier');
      }

      const updatedFileList = fileList.filter((file) => file !== fileName);
      setFileList(updatedFileList);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <DefaultLayoutAdmin>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Manage Chatbot Files</h2>

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            
            />
            {selectedFiles.length > 0 && (
              <ul className="mb-4">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-gray-700">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </label>
        </div>

        <div className="mb-4 mt-4">
          <button
            onClick={uploadFile}
            className="bg-black border-2 border-[#3e3e3e] rounded-lg text-white px-6 py-3 text-base hover:border-[#fff] cursor-pointer transition"
          >
            Upload
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-2">Uploaded Files</h3>
        <ul className=" divide-gray-200">
          {fileList.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center  border rounded mb-2 p-3"
            >
              <span className="text-gray-700 font-semibold">{file}</span>
              <button
                onClick={() => deleteFile(file, userId)}
                className="inline-flex items-center px-4 py-2 ml-2 bg-red-500 text-white px-2 p-2 rounded hover:bg-red-600"
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  ></path>
                </svg>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default ChatbotFiles;
