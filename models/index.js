const mongoose = require("mongoose");

// Local Users (public who report animals or adopt)
const localUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String,
    joinedOn: { type: Date, default: Date.now },
});

// NGO Users (admins or volunteers)
const ngoUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ["NGO_ADMIN", "VOLUNTEER"], default: "VOLUNTEER" },
});

// Reports (animal sightings)
const reportSchema = new mongoose.Schema({
    photoUrl: { type: String, required: true },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [Number], // [lng, lat]
    },
    description: String,
    donationIntent: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "TREATED"],
        default: "OPEN",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "LocalUser" },
    createdAt: { type: Date, default: Date.now },
    treatedAnimalId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatedAnimal" },
});
reportSchema.index({ location: "2dsphere" });

// Treated Animals
const treatedAnimalSchema = new mongoose.Schema({
    beforeReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    afterPhotoUrl: { type: String, required: true },
    healthNotes: String,
    adoptable: { type: Boolean, default: false },
    adoptionFee: Number,
    createdAt: { type: Date, default: Date.now },
});

// Ads (local pet shops)
const adSchema = new mongoose.Schema({
    shopName: String,
    logoUrl: String,
    link: String,
    startsOn: Date,
    endsOn: Date,
});

module.exports = {
    LocalUser: mongoose.model("LocalUser", localUserSchema),
    NgoUser: mongoose.model("NgoUser", ngoUserSchema),
    Report: mongoose.model("Report", reportSchema),
    TreatedAnimal: mongoose.model("TreatedAnimal", treatedAnimalSchema),
    Ad: mongoose.model("Ad", adSchema),
};
