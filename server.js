require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const db =
  process.env.DB_PROVIDER === "local"
    ? require("./database/local_db")
    : require("./database/neon_db");

const { sequelize } = db;

const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from your omnievents Node.js backend!");
});

let isDbConnected = false;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    isDbConnected = true;
    console.log("Database connected successfully!");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB", error);
    process.exit(1);
  }
};

app.get("/health", (req, res) => {
  if (isDbConnected) {
    return res.json({ status: "OK", db: "connected" });
  }
  return res.status(500).json({ status: "ERROR", db: "disconnected" });
});

startServer();
