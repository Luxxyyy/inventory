const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

const corsOptions = {
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('API is running. Visit /api to get fruit data.');
});

app.get('/api', (req, res) => {
    res.json({ fruits: ['apple', 'durian', 'melon', 'kitten'] });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
