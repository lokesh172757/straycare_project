const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['user', 'volunteer', 'ngo', 'general'] },
    phone: String,
    address: String,
    location: { type: { type: String }, coordinates: [Number] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

const AnimalReportSchema = new mongoose.Schema({
    reporterId: mongoose.Schema.Types.ObjectId,
    description: String,
    media: [{ type: String, url: String }],
    status: { type: String, enum: ['reported', 'in-progress', 'rescued'] },
    rescueTeamId: mongoose.Schema.Types.ObjectId,
    location: { type: { type: String }, coordinates: [Number] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

const VolunteerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    type: { type: String, enum: ['ngo', 'individual'] },
    location: { type: { type: String }, coordinates: [Number] },
    address: String,
    areasOfService: [String],
    availability: {
        days: [String],
        time: String
    },
    active: Boolean,
    rescuedAnimalsCount: Number,
    joinedAt: Date,
    lastActive: Date
});

const NgoSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    registrationNumber: String,
    type: String,
    website: String,
    logoUrl: String,
    location: { type: { type: String }, coordinates: [Number] },
    address: String,
    operationalAreas: [String],
    services: [String],
    approved: Boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
    joinedAt: Date,
    lastActive: Date
});

const RescuedAnimalSchema = new mongoose.Schema({
    name: String,
    age: String,
    breed: String,
    gender: String,
    healthStatus: String,
    vaccinated: Boolean,
    rescueReportId: mongoose.Schema.Types.ObjectId,
    media: [String],
    readyForAdoption: Boolean,
    adopted: Boolean,
    createdAt: { type: Date, default: Date.now }
});

const AdoptionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    animalId: mongoose.Schema.Types.ObjectId,
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    reason: String,
    createdAt: { type: Date, default: Date.now }
});

const DonationSchema = new mongoose.Schema({
    donorId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    paymentMethod: String,
    message: String,
    donationDate: Date,
    receiptUrl: String
});

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    images: [String],
    addedBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    UserSchema,
    AnimalReportSchema,
    VolunteerSchema,
    NgoSchema,
    RescuedAnimalSchema,
    AdoptionSchema,
    DonationSchema,
    ProductSchema
};
