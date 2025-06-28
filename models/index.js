const mongoose = require("mongoose");

// ===== Local Users =====
const localUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    passwordHash: String,
    joinedOn: { type: Date, default: Date.now },
});

// ===== NGO Users =====
const ngoUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: {
        type: String,
        enum: ["NGO_ADMIN", "VOLUNTEER"],
        default: "VOLUNTEER",
        uppercase: true
    },
});

// ===== Reports =====
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

// ===== Treated Animals =====
const treatedAnimalSchema = new mongoose.Schema({
    beforeReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    afterPhotoUrl: { type: String, required: true },
    healthNotes: String,
    adoptable: { type: Boolean, default: false },
    adoptionFee: Number,
    createdAt: { type: Date, default: Date.now },
});

// ===== Ads =====
const adSchema = new mongoose.Schema({
    shopName: String,
    logoUrl: String,
    link: String,
    startsOn: Date,
    endsOn: Date,
});

// ===== Adoption Requests =====
const adoptionRequestSchema = new mongoose.Schema({
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatedAnimal" },
    name: String,
    phone: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// ===== Model Export =====
module.exports = {
    LocalUser: mongoose.model("LocalUser", localUserSchema),
    NgoUser: mongoose.model("NgoUser", ngoUserSchema),
    Report: mongoose.model("Report", reportSchema),
    TreatedAnimal: mongoose.model("TreatedAnimal", treatedAnimalSchema),
    Ad: mongoose.model("Ad", adSchema),
    AdoptionRequest: mongoose.model("AdoptionRequest", adoptionRequestSchema),
};
