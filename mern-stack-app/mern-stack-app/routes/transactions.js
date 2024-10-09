// routes/transactions.js
const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Helper function to get month from date
const getMonth = (date) => {
  return new Date(date).toLocaleString('default', { month: 'long' });
};

// API to initialize the database
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany(); // Clear existing data
    await Transaction.insertMany(transactions); // Insert new data

    res.status(200).json({ message: 'Database initialized successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// API to list all transactions with search and pagination
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
      ],
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const totalCount = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, totalCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// API for statistics based on the selected month
router.get('/statistics/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const totalSales = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, new Date(Date.parse(month + " 1")).getMonth() + 1] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
          totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
          totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } },
        },
      },
    ]);

    res.status(200).json(totalSales[0] || { totalAmount: 0, totalSoldItems: 0, totalNotSoldItems: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// API for bar chart data
router.get('/bar-chart/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const barChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, new Date(Date.parse(month + " 1")).getMonth() + 1] },
        },
      },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Number.MAX_VALUE],
          default: '901-above',
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.status(200).json(barChartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get bar chart data' });
  }
});

// API for pie chart data
router.get('/pie-chart/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, new Date(Date.parse(month + " 1")).getMonth() + 1] },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pie chart data' });
  }
});

// API to combine data from all three previous APIs
router.get('/combined/:month', async (req, res) => {
  const { month } = req.params;

  try {
    const statistics = await router.handle(req, res, '/statistics/' + month);
    const barChart = await router.handle(req, res, '/bar-chart/' + month);
    const pieChart = await router.handle(req, res, '/pie-chart/' + month);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to combine data' });
  }
});

module.exports = router;
