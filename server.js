require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// const { sequelize } = require('./database/neon_db');
const db = process.env.DB_PROVIDER === "local" ? require("./database/local_db") : require("./database/neon_db");

const { sequelize } = db;

const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "OK", db: "connected" });
  } catch {
    res.status(500).json({ status: "ERROR", db: "disconnected" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from your omnievents Node.js backend!");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB", error);
    process.exit(1);
  }
};

startServer();
