const router = require("express").Router();
const Registration = require("../models/Registration");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

/* LOGIN */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password required" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ message: "Login Success" });
  } else {
    return res.status(401).json({ message: "Invalid Password" });
  }
});

/* FETCH REGISTRATIONS */
router.get("/registrations", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error:
        "Database is not connected. Check MONGO_URI and MongoDB Atlas Network Access.",
    });
  }

  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE REGISTRATION */
router.delete("/registrations/:id", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error:
        "Database is not connected. Check MONGO_URI and MongoDB Atlas Network Access.",
    });
  }

  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Registration not found" });
    }

    if (deleted.image) {
      const imagePath = path.join(__dirname, "../../uploads", deleted.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Registration deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
