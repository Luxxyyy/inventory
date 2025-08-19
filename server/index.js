require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Fruit = require('./models/fruit_model');

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

const fruitRoutes = require('./routes/fruit_route');
app.use('/api/fruits', fruitRoutes);

sequelize.sync().then(() => {
  console.log('DB synced');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
