import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './axiosConfig';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import Chatbot from './Chatbot'; // Import the Chatbot component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,  // Register PointElement for line charts
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface DataRecord {
  [key: string]: any; // Define dynamic keys to accommodate all columns
}

const DataVisualization: React.FC = () => {
  let { fileId } = useParams<{ fileId: string }>(); // Get fileId from URL params
  const [data, setData] = useState<DataRecord[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string | null>(null); // Track filter selection for drilldown
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar'); // Manage chart type selection

  // Fetch data for visualization with optional filter
  const fetchData = async (filterLabel: string | null = null) => {
    setLoading(true);
    try {
      // Construct API endpoint with fileId and optional filter

      console.log(fileId);
      const endpoint = filterLabel
        ? `visualize/${fileId}/?filter=${filterLabel}`
        : `visualize/${fileId}/`;
      const response = await api.get(endpoint);
      const responseData = response.data.data;
      setData(responseData);
      setFileName(response.data.file_name);
    } catch (error: unknown) {
      setError('Failed to load data.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle chart click and apply drilldown filter
  const handleChartClick = (event: any, elements: any) => {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = data[clickedIndex][Object.keys(data[0])[0]];  // Assuming first column is the label
      console.log('Clicked label:', clickedLabel);  // Log clicked label for drilldown
      setFilter(clickedLabel);  // Set filter to apply drilldown
    }
  };

  // Handle chatbot queries for data interactions
  const handleChatbotQuery = (query: string) => {
    console.log('Chatbot query received:', query);
    // Use the chatbot query to filter or interact with data
    setFilter(query); // Apply the query as a filter
  };

  useEffect(() => {
    if (String(localStorage.getItem('selectedFile'))) {
      console.log(String(localStorage.getItem('selectedFile')));
      fileId = String(localStorage.getItem('selectedFile'));
      fetchData(filter);  // Fetch data when filter changes or initially loads
    }
    else {
      fileId = "1";
      fetchData(filter);  // Fetch data when filter changes or initially loads
    }
  }, [fileId, filter]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (data.length === 0) {
    return <p>No data available for visualization.</p>;
  }

  const labels = data.map((row) => row[Object.keys(data[0])[0]]); // Get labels from the first column
  const values = data.map((row) => {
    const value = row[Object.keys(row)[3]];  // Assuming second column holds values
    return isNaN(value) ? 0 : Number(value); // Ensure the values are numeric
  });

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: '#1695D9',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartPi = {
    labels,
    datasets: [
      {
        label: `Data from ${fileName}`,
        data: values,
        backgroundColor: ['#08A85F', '#BA6B0E', '#FFA726', '#087FC0', '#BB195F'],  // Example colors for pie chart
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        position: 'top' as const,
      },
    },
    onClick: handleChartClick, // Handle click events for drilldown
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">Data from {fileName}</h1>
      {/* Render the appropriate chart based on selected chart type */}
      <div className="flex flex-row gap-20 mt-10">
        <div className='w-[50%]'>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className='w-[50%]'>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="flex flex-row gap-20 mt-10">
        <div className='w-[42%]'>
          <Pie data={chartPi} options={chartOptions} />
        </div>
        <div className='w-[42%] ml-24'>
          <Doughnut data={chartPi} options={chartOptions} />
        </div>
      </div>
      {/* Add the Chatbot component */}
      <Chatbot onDataQuery={handleChatbotQuery} />

      {/* Display Data Table */}
      <h1 className="text-2xl font-bold mb-4 text-white mt-10">Products</h1>
      <table className="table-auto w-full mb-4 text-white rounded-2xl">
        <thead className='bg-[#1C242E]'>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="px-4 py-2 rounded-t-[20px]">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key} className="border px-4 py-2 border-[#22353E]">{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataVisualization;
