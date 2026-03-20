require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');

const { pool, sequelize } = require('./database/local_db');


const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from your omnievents Node.js backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
