const mongoose = require("mongoose");

const volunteerUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String,
    joinedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VolunteerUser", volunteerUserSchema);
