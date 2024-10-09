import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/transactions/statistics/${selectedMonth}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="statistics">
      <h2>Transaction Statistics - {selectedMonth}</h2>
      <div className="stats-box">
        <div className="stat">
          <h3>Total Sales Amount</h3>
          <p>${statistics.totalAmount}</p>
        </div>
        <div className="stat">
          <h3>Total Sold Items</h3>
          <p>{statistics.totalSoldItems}</p>
        </div>
        <div className="stat">
          <h3>Total Not Sold Items</h3>
          <p>{statistics.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
