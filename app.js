require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const Ngo = require("./models/ngo");

const app = express();

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("❌ MongoDB error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        touchAfter: 24 * 3600
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use("user-local", new LocalStrategy(User.authenticate()));
passport.use("ngo-local", new LocalStrategy(Ngo.authenticate()));
passport.serializeUser((user, done) => {
    done(null, { id: user.id, type: user instanceof Ngo ? "Ngo" : "User" });
});
passport.deserializeUser((obj, done) => {
    const Model = obj.type === "Ngo" ? Ngo : User;
    Model.findById(obj.id).then(user => done(null, user)).catch(err => done(err));
});

// Flash and locals middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Routes
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const adoptionRoutes = require("./routes/adoptions");
const animalRoutes = require("./routes/animals");
const adRoutes = require("./routes/ads");

app.use("/", authRoutes);
app.use("/report", reportRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/animals", animalRoutes);
app.use("/ads", adRoutes);

// Root route
app.get("/", (req, res) => {
    res.render("home");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
