require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
    try {
        let qs = `SELECT * FROM users`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

app.get('/api/posts', (req, res) => {
    try {
        let qs = `SELECT * FROM posts`;
        query(qs).then(data => res.json(data.rows));
    } catch (err) {
        console.error("something went wrong: " + err);
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});