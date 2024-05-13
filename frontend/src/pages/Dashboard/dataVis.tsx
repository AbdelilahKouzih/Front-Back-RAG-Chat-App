import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import axios from 'axios';
import { BsFileEarmarkArrowUp } from 'react-icons/bs';
import Chart from 'chart.js/auto'; // Import Chart.js

const DataVis: React.FC = () => {
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
   

       // Créer une fonction pour afficher les données JSON dans un graphique
       const renderCharts = () => {
        if (jsonData) {
            renderBarChart();
            renderLineChart();
            renderPieChart();
            renderRadarChart();
        }
    };

    const renderBarChart = () => {
        const ctx = document.getElementById('barChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: jsonData.map(data => data.Months),
                datasets: [{
                    label: 'Bar Chart',
                    data: jsonData.map(data => data.ID),
                    backgroundColor: "hsl(252, 82.9%, 67.8%)",
                    borderColor: "hsl(252, 82.9%, 67.8%)",
      
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };



const renderLineChart = () => {
    const ctx = document.getElementById('lineChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: jsonData.map(data => data.Months),
            datasets: [{
                label: 'Line Chart',
                data: jsonData.map(data => data.ID),
                backgroundColor: "hsl(252, 82.9%, 67.8%)",
                borderColor: "hsl(252, 82.9%, 67.8%)",
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const renderPieChart = () => {
    const ctx = document.getElementById('pieChart');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: jsonData.map(data => data.Months),
            datasets: [{
                label: 'Pie Chart',
                data: jsonData.map(data => data.ID),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const renderRadarChart = () => {
    const ctx = document.getElementById('radarChart');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: jsonData.map(data => data.Months),
            datasets: [{
                label: 'Radar Chart',
                data: jsonData.map(data => data.ID),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true
                }
            }
        }
    });
};

    useEffect(() => {
        renderCharts();    
    }, [jsonData]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/xlsx-files');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('xlsxFile', file);
        });

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/upload-xlsx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setJsonData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du téléversement :', error);
            setLoading(false);
        }
    };

    const convertXLSXToJson = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        formData.append('xlsxFile', files[0]);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/xlsxtojson', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setJsonData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la conversion XLSX en JSON :', error);
            setLoading(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
                    
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={convertXLSXToJson}
                   />
                 <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2  bg-slate-500 text-white rounded-lg shadow-sm hover: bg-slate-400 transition duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M4 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM10 2a2 2 0 0 1 2 2v6a2 2 0 1 1-4 0V4a2 2 0 0 1 2-2zm6 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" clip-rule="evenodd"/>
                 <path d="M16 16a2 2 0 0 1-2-2v-6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2zm-6 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-6-5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                 </svg>
                 <span>Visualer vos données !</span>
                 </label>



                   
                    <div className="flex flex-row">
                    <div className="w-140 h-90">
                    <canvas id="barChart" className="w-full h-full"></canvas>
                    </div>
                    <div className="w-140 h-90">
                        <canvas id="lineChart" className="w-full h-full"></canvas>
                    </div>
                    </div>
                       <div className="flex justify-between">
                        <div className="w-100 h-90">
                            <canvas id="pieChart" className="w-full h-full"></canvas>
                        </div>
                        <div className="w-100 h-100">
                            <canvas id="radarChart" className="w-full h-full"></canvas>
                        </div>
                        </div>

                </div>
            </div>
            
           
        </DefaultLayout>
    );
};

export default DataVis;
