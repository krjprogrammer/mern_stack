import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchTransactions();
    // Reset to first page when month changes
    setPage(1);
  }, [selectedMonth, search, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions', {
        params: {
          page,
          perPage,
          search,
        }
      });

      // Filter transactions by selected month
      const filteredTransactions = response.data.transactions.filter(tx => {
        const txMonth = new Date(tx.dateOfSale).toLocaleString('default', { month: 'long' });
        return txMonth === selectedMonth;
      });

      setTransactions(filteredTransactions);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalCount / perPage)) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <div className="transactions-table">
      <h2>Transactions</h2>
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Date Of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{tx.title}</td>
              <td>{tx.description}</td>
              <td>{tx.price}</td>
              <td>{tx.category}</td>
              <td>{new Date(tx.dateOfSale).toLocaleDateString()}</td>
              <td>{tx.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {Math.ceil(totalCount / perPage)}</span>
        <button onClick={handleNextPage} disabled={page === Math.ceil(totalCount / perPage)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
