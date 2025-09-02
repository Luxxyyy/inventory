require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./db");

const app = express();
const PORT = process.env.PORT || 8080;

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "sessions",
  extendDefaultFields: (defaults, session) => {
    return {
      data: defaults.data,
      expires: defaults.expires,
      user_id: session.user_id,
    };
  },
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "qbwd_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
const mapShapeRoutes = require("./routes/map_shape_route");
app.use("/api/map-shapes", mapShapeRoutes);

const sourceRoute = require("./routes/source_route");
app.use("/api/sources", sourceRoute);

const balangayRoute = require("./routes/balangay_route");
app.use("/api/balangays", balangayRoute);

const purokRoute = require("./routes/purok_route");
app.use("/api/puroks", purokRoute);

const authRoute = require("./routes/auth_route");
app.use("/api/auth", authRoute);

const pipeLogRoutes = require("./routes/pipe_log_route");
app.use("/api/pipe-logs", pipeLogRoutes);

const User = require("./models/user_model");

sequelize
  .sync()
  .then(async () => {
    console.log("DB synced");

    const adminUser = await User.findOne({ where: { username: "admin" } });
    if (!adminUser) {
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash("admin123", saltRounds);

      await User.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("Default admin user created: admin/admin123");
    }

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Sequelize init error:", err);
    process.exit(1);
  });
