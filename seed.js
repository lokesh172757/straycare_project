const mongoose = require("mongoose");
const {
    LocalUser,
    NgoUser,
    Report,
    TreatedAnimal,
    Ad
} = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seedDatabase() {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/straycare");

    await LocalUser.deleteMany({});
    await NgoUser.deleteMany({});
    await Report.deleteMany({});
    await TreatedAnimal.deleteMany({});
    await Ad.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);

    const user1 = await LocalUser.create({
        name: "Ravi Sharma",
        email: "ravi@example.com",
        phone: "9876543210",
        passwordHash
    });

    const user2 = await LocalUser.create({
        name: "Priya Mehta",
        email: "priya@example.com",
        phone: "9876504321",
        passwordHash
    });

    const ngo = await NgoUser.create({
        name: "Animal Rescue Foundation",
        email: "ngo@example.com",
        passwordHash,
        role: "NGO_ADMIN"
    });

    const report1 = await Report.create({
        photoUrl: "https://placekitten.com/400/300",
        location: { coordinates: [77.216721, 28.644800] },
        description: "Injured dog limping on road",
        userId: user1._id
    });

    const report2 = await Report.create({
        photoUrl: "https://placekitten.com/401/301",
        location: { coordinates: [77.209021, 28.613939] },
        description: "Sick cat near market",
        userId: user2._id,
        status: "OPEN"  // 👈 keep this one open
    });

    const treatedAnimal1 = await TreatedAnimal.create({
        beforeReportId: report1._id,
        afterPhotoUrl: "https://placekitten.com/402/302",
        healthNotes: "Treated leg injury. Vaccinated.",
        adoptable: true,
        adoptionFee: 500
    });

    await Report.findByIdAndUpdate(report1._id, {
        status: "TREATED",
        treatedAnimalId: treatedAnimal1._id
    });

    await Ad.insertMany([
        {
            shopName: "Paws & Whiskers Pet Shop",
            logoUrl: "https://placehold.co/100x50",
            link: "https://pawswhiskers.com",
            startsOn: new Date(),
            endsOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        },
        {
            shopName: "Bark Avenue",
            logoUrl: "https://placehold.co/101x50",
            link: "https://barkavenue.com",
            startsOn: new Date(),
            endsOn: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
        }
    ]);

    console.log("✅ Seed data inserted successfully!");
    mongoose.connection.close();
}

seedDatabase();
