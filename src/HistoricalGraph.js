import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

const HistoricalGraph = ({ data }) => {
  const [selectedParameter, setSelectedParameter] = useState('humidity');

  const handleParameterChange = (event) => {
    setSelectedParameter(event.target.value);
  };

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: selectedParameter,
        data: data.map((item) => item[selectedParameter]),
        fill: false,
        borderColor: 'blue',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: selectedParameter,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3>Historical Weather Data</h3>
      <div>
        <select value={selectedParameter} onChange={handleParameterChange}>
          <option value="temperature">Temperature</option>
          <option value="windspeed">Wind Speed</option>
          <option value="humidity">Humidity</option>
        </select>
      </div>
      <div className="chart-wrapper">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default HistoricalGraph;
