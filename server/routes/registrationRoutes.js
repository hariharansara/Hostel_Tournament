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
      phone: req.body.phone,
      email: req.body.email,
      room: req.body.room,
      image: req.file ? req.file.filename : null,
    });

    await data.save();

    res.json({ message: "Registration Saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
