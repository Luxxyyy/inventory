require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Fruit = require('./models/Fruit');

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running. Visit /apiFruits to get fruit data.');
});

app.get('/apiFruits', async (req, res) => {
  try {
    const fruits = await Fruit.findAll({
      attributes: ['fruit_name', 'description'],
    });

    const names = fruits.map(f => f.fruit_name);
    const desc = fruits.map(f => f.description);

    res.json({ fruits: names, desc });
  } catch (error) {
    console.error('Sequelize error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

sequelize.sync().then(() => {
  console.log('DB synced');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
