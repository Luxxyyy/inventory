require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

app.get('/', (req, res) => {
  res.send('API is running. Visit /apiFruits to get fruit data.');
});

app.get('/apiFruits', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT fruit_name, description FROM fruits');
    const fruits = rows.map(row => row.fruit_name);
    const desc = rows.map(row => row.description);
    
    res.json({ fruits, desc });
  } catch (error) {
    console.error('Error fetching fruits from DB:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
