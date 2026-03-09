const router = require("express").Router();
const Registration = require("../models/Registration");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const normalizePlayerNames = (value) => {
  if (Array.isArray(value)) {
    return value.map((name) => String(name).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
};

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const data = new Registration({
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

    await data.save();

    res.json({ message: "Registration Saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
