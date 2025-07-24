const mongoose = require("mongoose");
const {
    LocalUser,
    NgoUser,
    Report,
    TreatedAnimal,
    Ad
} = require("./models");

async function clearDatabase() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/straycare", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ Connected to DB:", mongoose.connection.name);

        console.log("🧹 Deleting all data...");

        const deletedUsers = await LocalUser.deleteMany({});
        const deletedNgos = await NgoUser.deleteMany({});
        const deletedReports = await Report.deleteMany({});
        const deletedTreated = await TreatedAnimal.deleteMany({});
        const deletedAds = await Ad.deleteMany({});

        console.log(`🗑️ Deleted LocalUsers: ${deletedUsers.deletedCount}`);
        console.log(`🗑️ Deleted NgoUsers: ${deletedNgos.deletedCount}`);
        console.log(`🗑️ Deleted Reports: ${deletedReports.deletedCount}`);
        console.log(`🗑️ Deleted TreatedAnimals: ${deletedTreated.deletedCount}`);
        console.log(`🗑️ Deleted Ads: ${deletedAds.deletedCount}`);

        console.log("✅ All collections cleared.");
    } catch (err) {
        console.error("❌ Error clearing database:", err);
    } finally {
        mongoose.connection.close();
    }
}

clearDatabase();
