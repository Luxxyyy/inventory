require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
const fruitRoutes = require("./routes/fruit_route");
app.use("/api/fruits", fruitRoutes);

const mapShapeRoutes = require("./routes/map_shape_route");
app.use("/api/map-shapes", mapShapeRoutes);

const pipeLogRoutes = require("./routes/pipe_log_route");
app.use("/api/map-shapes", pipeLogRoutes);

const sourceRoute = require("./routes/source_route");
app.use("/api/sources", sourceRoute);

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
