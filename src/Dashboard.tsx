import React, { useState, useEffect } from 'react';
import ChartComponent from './ChartComponent';
import api from './axiosConfig';
import { useParams } from 'react-router-dom';  // Import for accessing URL params

interface DataRecord {
  [key: string]: any; // Dynamic keys to represent the columns of the data
}

const Dashboard: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>(); // Get fileId from the URL
  const [data, setData] = useState<DataRecord[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line'); // Manage chart type
  const [filter, setFilter] = useState<string | null>(null); // Keep track of the selected filter

  // Fetch data for visualization
  const fetchData = async (filterLabel: string | null = null) => {
    setLoading(true);
    try {
      // Use fileId in the API endpoint to fetch data for that specific file
      const endpoint = filterLabel
        ? `visualize/${fileId}/?filter=${filterLabel}`
        : `visualize/${fileId}/`;

      console.log('Fetching data from:', endpoint); // Debug log for the endpoint being used
      const response = await api.get(endpoint);
      const responseData = response.data.data;
      const responseLabels = responseData.map((item: any) => Object.values(item)[0]); // Extract labels (first column)

      setData(responseData);
      setLabels(responseLabels);
    } catch (error: unknown) {
      // Handle errors using type assertion or type checking
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setError(`Failed to load data: ${(error as Error).message}`);
      } else {
        setError('Failed to load data: Unknown error');
      }
      console.error('Error fetching data:', error); // Log the error
    } finally {
      setLoading(false);
    }
  };

  // Handle click event on chart and apply drilldown filter
  const handleChartClick = (clickedLabel: string) => {
    console.log('Chart clicked with label:', clickedLabel);
    setFilter(clickedLabel); // Set the filter to the clicked label
  };

  useEffect(() => {
    // Fetch data whenever the filter or fileId changes
    if (fileId) {
      fetchData(filter);
    }
  }, [filter, fileId]);

  const handleChartTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value as 'line' | 'bar');
  };

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Filter and Chart Type Selection */}
      <div className="mb-4">
        <label className="mr-2">Choose Chart Type: </label>
        <select value={chartType} onChange={handleChartTypeChange} className="border p-2">
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {/* Chart Component */}
      <ChartComponent data={data} labels={labels} chartType={chartType} onChartClick={handleChartClick} />
    </div>
  );
};

export default Dashboard;
