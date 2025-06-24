const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ===== User Schema =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["general", "volunteer", "ngo", "admin"],
        required: true
    },
    preferredLang: { type: String, required: true },
    phoneOtp: { type: String, required: true },
    bio: String,
    address: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.index({ location: "2dsphere" });

// ===== Report Schema =====
const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    photoUrl: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: { type: [Number], required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'treated', 'resolved'],
        default: 'pending'
    },
    rescueOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

reportSchema.index({ location: "2dsphere" });

// ===== Volunteer Schema =====
const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availability: String,
    areaOfService: String,
    skills: [String],
    approved: { type: Boolean, default: false },
    type: { type: String, enum: ['multi-ngo', 'single-ngo', 'individual'] },
    active: Boolean,
    rescuedAnimalsCount: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    lastActive: Date
});

// ===== Rescued Animal Schema =====
const rescuedAnimalSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String,
    gender: { type: String, enum: ['male', 'female'] },
    healthStatus: String,
    vaccinated: { type: Boolean, default: false },
    rescueReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
    media: [String]
}, { timestamps: true });

// ===== Adoption Schema =====
const adoptionSchema = new mongoose.Schema({
    rescuedAnimal: { type: mongoose.Schema.Types.ObjectId, ref: 'RescuedAnimal' },
    animalName: String,
    species: { type: String, enum: ['dog', 'cat', 'other'] },
    age: String,
    healthStatus: String,
    description: String,
    imageUrl: String,
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
    adopted: { type: Boolean, default: false },
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: { createdAt: 'postedAt' } });

// ===== Donation Schema =====
const donationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
    amount: { type: Number, required: true },
    message: String,
    donationDate: Date,
    receiptUrl: String
}, { timestamps: true });

// ===== Pet Store Schema =====
const petStoreSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    ownerName: String,
    contactNumber: {
        type: String,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    category: {
        type: String,
        enum: ['pet food', 'supplies', 'clinic', 'grooming', 'vet'],
        required: true
    },
    website: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: { type: [Number], required: true }
    },
    imageUrl: String,
    isSponsor: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
}, { timestamps: true });

petStoreSchema.index({ location: "2dsphere" });

// ===== NGO Schema =====
const ngoSchema = new mongoose.Schema({
    ngoName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    registrationDocUrl: String,
    contactPerson: String,
    contactEmail: {
        type: String,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    contactPhone: {
        type: String,
        match: /^[0-9]{10}$/
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    serviceAreas: [String],
    facilities: {
        shelterCapacity: Number,
        inHouseVets: Number,
        ambulances: Number
    },
    website: String,
    logoUrl: String,
    verified: { type: Boolean, default: false },
    joinedAt: Date,
    lastActive: Date
}, { timestamps: true });


// ====== Export Models ======
module.exports = {
    User: mongoose.model("User", userSchema),
    Report: mongoose.model("Report", reportSchema),
    Volunteer: mongoose.model("Volunteer", volunteerSchema),
    RescuedAnimal: mongoose.model("RescuedAnimal", rescuedAnimalSchema),
    Adoption: mongoose.model("Adoption", adoptionSchema),
    Donation: mongoose.model("Donation", donationSchema),
    PetStore: mongoose.model("PetStore", petStoreSchema),
    NGO: mongoose.model("NGO", ngoSchema)
};
