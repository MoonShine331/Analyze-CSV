import React, { useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
  data: any[];  // Array of data objects with dynamic keys
  labels: string[];  // Labels for the X-axis
  chartType: 'line' | 'bar'; // Chart type selection
  onChartClick: (clickedLabel: string) => void; // Callback for chart click
}

const ChartComponent: React.FC<ChartProps> = ({ data, labels, chartType, onChartClick }) => {
  const chartRef = useRef<any>(null);  // Reference to the chart instance

  const datasetValues = data.map(item => Object.values(item)[1]);  // Extract Y-axis values from data

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Data Visualization',
        data: datasetValues,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: chartType === 'line' ? 'rgba(75,192,192,0.2)' : 'rgba(75, 192, 192, 0.8)',
        borderWidth: 2,
        fill: chartType === 'line',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Dynamic Data Visualization',
      },
    },
  };

  // Handle the chart click event
  const handleChartClick = (event: any) => {
    console.log("EVENT");
    const chartInstance = chartRef.current;
    if (!chartInstance) return;

    const elements = chartInstance.getElementAtEvent(event);  // Get clicked elements

    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedLabel = labels[clickedIndex];  // Get the label of the clicked element
      console.log('Clicked label:', clickedLabel);  // Log the clicked label

      // Trigger the click callback with the clicked label
      onChartClick(clickedLabel);
    } else {
      console.log('No chart element was clicked.');
    }
  };

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
      <Chart
        ref={chartRef}
        type={chartType === 'line' ? 'line' : 'bar'}
        data={chartData}
        options={options}
        onClick={handleChartClick}  // Attach the click event handler
      />
    </div>
  );
};

export default ChartComponent;
