import React, { useState, useEffect } from 'react';
import './App.css';
import MonthDropdown from './components/MonthDropdown';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState('March'); // Default month

  return (
    <div className="App">
      <header>
        <h1>MERN Stack Transactions Dashboard</h1>
      </header>
      <main>
        <MonthDropdown selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        <Statistics selectedMonth={selectedMonth} />
        <TransactionsTable selectedMonth={selectedMonth} />
        <BarChart selectedMonth={selectedMonth} />
      </main>
    </div>
  );
};

export default App;
