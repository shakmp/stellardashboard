import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonthlyTrendChart = ({ monthlyPOA, monthlyAC }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    const chartData = {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      datasets: [
        {
          label: 'POA',
          data: monthlyPOA,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
        {
          label: 'AC System Output',
          data: monthlyAC,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        },
      ],
    };

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      chartInstance.destroy(); 
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          x: {
            type: 'category',
          },
        },
      },
    });

    return () => {
      if (chartInstance) {
        chartInstance.destroy(); 
      }
    };
  }, [monthlyPOA, monthlyAC]);

  return <canvas ref={chartRef} />;
};

export default MonthlyTrendChart;
