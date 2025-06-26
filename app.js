const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/straycare")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Routes
const reportRoutes = require("./routes/report");
const adoptionRoutes = require("./routes/adoption");
const ngoRoutes = require("./routes/ngo");
const adRoutes = require("./routes/ads");

app.use("/report", reportRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/ngo", ngoRoutes);
app.use("/ads", adRoutes);

// Homepage route
const { TreatedAnimal, Ad } = require("./models");   // ⬅️  add Ad here

app.get("/", async (req, res) => {
    const animals = await TreatedAnimal.find({}).limit(6);      // still show 6 animals
    const ads = await Ad.find({});                         // fetch all ads (or use .limit / aggregate)

    res.render("home", { animals, ads });                       // ⬅️  pass ads too
});


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
