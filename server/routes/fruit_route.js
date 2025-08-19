const express = require('express');
const router = express.Router();
const Fruit = require('../models/fruit_model');

router.get('/', async (req, res) => {
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

// POST /api/fruits
router.post('/', async (req, res) => {
  try {
    const { fruit_name, description } = req.body;

    if (!fruit_name) {
      return res.status(400).json({ error: 'fruit_name is required' });
    }

    const newFruit = await Fruit.create({
      fruit_name,
      description,
    });

    res.status(201).json(newFruit);
  } catch (error) {
    console.error('Error inserting fruit:', error);
    res.status(500).json({ error: 'Failed to insert fruit' });
  }
});

module.exports = router;
