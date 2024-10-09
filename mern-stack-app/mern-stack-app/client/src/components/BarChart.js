import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ selectedMonth }) => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: '# of Items',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/transactions/bar-chart/${selectedMonth}`);
      const labels = response.data.map(bucket => bucket._id.toString());
      const data = response.data.map(bucket => bucket.count);

      setBarData({
        labels,
        datasets: [
          {
            label: '# of Items',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  return (
    <div className="bar-chart">
      <h2>Price Range Distribution - {selectedMonth}</h2>
      <Bar
        data={barData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              precision: 0
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;