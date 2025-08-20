require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

// CORS (optional when using Vite proxy; safe to keep)
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.options("splat", cors(corsOptions)); // <-- fixed from 'splat' to '*'

app.use(express.json());

// Routes
const fruitRoutes = require("./routes/fruit_route");
app.use("/api/fruits", fruitRoutes);

sequelize
  .sync()
  .then(() => {
    console.log("DB synced");
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Sequelize init error:", err);
    process.exit(1);
  });
