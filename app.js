const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const reportRoutes = require("./routes/report");
const adoptionRoutes = require("./routes/adoption");
const adoptRoutes = require("./routes/adopt");
const ngoRoutes = require("./routes/ngo");
const adRoutes = require("./routes/ads");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const dashboardRoutes = require("./routes/dashboard");

const { TreatedAnimal, Ad } = require("./models");
const { isLoggedIn, isNGO } = require("./middleware/auth");

const app = express();

// ===== DB Connect =====
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/straycare")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

// ===== View Engine & Static =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ===== Session & Flash =====
app.use(session({
    secret: "straycareSecret@123",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/straycare"
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// ===== Global Template Variables =====
app.use((req, res, next) => {
    res.locals.currentUserId = req.session.userId;
    res.locals.currentUserKind = req.session.userKind;
    res.locals.userName = req.session.userName;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ===== Routes =====
app.use("/user", userRoutes);
app.use("/report", reportRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/adopt", adoptRoutes);
app.use("/ads", adRoutes);
app.use("/auth", authRoutes);
app.use("/ngo", isLoggedIn, isNGO, ngoRoutes);
app.use(dashboardRoutes);

// ===== Home Route =====
app.get("/", async (req, res) => {
    const treatedAnimals = await TreatedAnimal.find({});
    const ads = await Ad.find({});
    res.render("home", { animals: treatedAnimals, ads });
});

// ===== Server Start =====
app.listen(8080, () => {
    console.log("🚀 Server running at http://localhost:8080");
});
