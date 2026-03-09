const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const Registration = require("./models/Registration");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const uploadDir = path.join(__dirname, "../uploads");
const legacyUploadDir = path.join(__dirname, "uploads");
const isDbReady = () => mongoose.connection.readyState === 1;
const normalizePlayerNames = (value) => {
  if (Array.isArray(value)) {
    return value.map((name) => String(name).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
};

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));
app.use("/server/uploads", express.static(legacyUploadDir));
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[REQ] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

/* ================= MONGODB CONNECTION ================= */

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Add it to environment variables.");
  process.exit(1);
}

mongoose.set("bufferCommands", false);

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 6000 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connect error:", err.message);
  });

/* ================= IMAGE UPLOAD ================= */

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(legacyUploadDir)) {
  fs.mkdirSync(legacyUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

app.use("/api/admin", adminRoutes);

app.get(/^\/admin$/, (req, res) => {
  res.redirect("/admin/login.html");
});

app.get(/^\/portal$/, (req, res) => {
  res.redirect("/portal/");
});

app.get("/index.html", (req, res) => {
  res.redirect("/portal/index.html");
});

app.use("/admin", express.static(path.join(__dirname, "../admin")));
app.use("/portal", express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.send(`
    <h2>Hostel Tournament Links</h2>
    <p><a href="/admin">Admin Portal</a></p>
    <p><a href="/portal/">Player Registration Portal</a></p>
  `);
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post("/api/register", upload.single("image"), async (req, res) => {
  if (!isDbReady()) {
    return res.status(503).json({
      error:
        "Database is not connected. Check MONGO_URI and MongoDB Atlas Network Access.",
    });
  }

  try {
    const newRegistration = new Registration({
      game: req.body.game,
      type: req.body.type,
      division: req.body.division,

      fullName: req.body.fullName,
      teamName: req.body.teamName,
      captainName: req.body.captainName,
      name: req.body.name,
      playerNames: normalizePlayerNames(req.body.playerNames),

      phone: req.body.phone,
      email: req.body.email,
      room: req.body.room,
      transactionId: req.body.transactionId || req.body.upiId,
      upiId: req.body.upiId,
      image: req.file ? req.file.filename : null,
    });

    await newRegistration.save();

    res.json({ message: "Registration Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  console.log(`Server running on ${baseUrl}`);
  console.log(`Admin link:  ${baseUrl}/admin`);
  console.log(`Player link: ${baseUrl}/portal/`);
});
