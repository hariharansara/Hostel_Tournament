const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  game: String,
  type: String,
  division: String,

  fullName: String,
  name: String,
  playerNames: [String],

  teamName: String,
  captainName: String,

  phone: String,
  email: String,
  room: String,
  transactionId: String,
  upiId: String,
  image: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Registration", registrationSchema);
