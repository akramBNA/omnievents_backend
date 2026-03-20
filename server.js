const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from your omnievents Node.js backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
