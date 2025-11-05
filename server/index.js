require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./db");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ======================
// SOCKET.IO SETUP
// ======================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost",
      "http://192.168.1.51",
      `http://${process.env.HOST || "192.168.1.253"}`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.set("io", io);
const PORT = process.env.PORT || 8080;

// ======================
// SESSION
// ======================
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "sessions",
  extendDefaultFields: (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    user_id: session?.user?.id,
  }),
});

sessionStore.sync();

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

// ======================
// CORS
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost",
  "http://192.168.1.51",
  `http://${process.env.HOST || "192.168.1.253"}`,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else {
      console.warn("❌ Blocked CORS request from:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ======================
// MIDDLEWARE & ROUTES
// ======================
const { attachUser } = require("./middleware/auth_middleware");
app.use(attachUser);
app.use("/api/map-shapes", require("./routes/map_shape_route"));
app.use("/api/sources", require("./routes/source_route"));
app.use("/api/balangays", require("./routes/balangay_route"));
app.use("/api/puroks", require("./routes/purok_route"));
app.use("/api/auth", require("./routes/auth_route"));
app.use("/api/users", require("./routes/user_route"));
app.use("/api/pipe-logs", require("./routes/pipe_log_route"));
app.use("/api/logs", require("./routes/log_route"));
app.use("/api/notes", require("./routes/notes_route"));
app.use("/api/legend", require("./routes/legend_route"));
app.use("/api/sheets", require("./routes/sheet_route"));
app.use("/api/messages", require("./routes/message_route"));
app.use("/api/conversations", require("./routes/conversation_route"));
app.use("/api/inventory", require("./routes/inventory_route"));
app.use("/api/items", require("./routes/item_route"));
app.use("/api/categories", require("./routes/category_route"));
app.use("/api/suppliers", require("./routes/supplier_route"));

// ======================
// SERVE FRONTEND BUILD
// ======================
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// SOCKET.IO HANDLERS
// ======================
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("join", ({ userId }) => {
    if (!userId) return;
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`✅ User ${userId} joined room ${room}`);
  });

  socket.on("mark_read", ({ conversation_id, user_id }) => {
    console.log(
      `📘 User ${user_id} marked conversation ${conversation_id} as read`
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ======================
// DATABASE INIT
// ======================
const User = require("./models/user_model");

sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB connection established");

    const adminUser = await User.findOne({ where: { username: "admin" } });
    if (!adminUser) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash("sharingun11234", 10);

      await User.create({
        username: "admin",
        email: "alfjoseph.silao@gmail.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Default admin user created: ajsilao / sharingun11234");
    }

    server.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Sequelize init error:", err);
    process.exit(1);
  });
