const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { LocalUser, NgoUser } = require("../models");

// Helper to login and store session data
function loginUser(req, user, kind) {
    req.session.userId = user._id;
    req.session.userKind = kind;       // "LOCAL" or "NGO"
    req.session.userName = user.name;  // For displaying in navbar
}

// ===== REGISTER ROUTES =====

// Local user register form
router.get("/register/local", (req, res) => {
    res.render("auth/registerLocal");
});

// NGO register form
router.get("/register/ngo", (req, res) => {
    res.render("auth/registerNgo");
});

// Local user registration handler
router.post("/register/local", async (req, res) => {
    const { name, email, phone, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await LocalUser.create({ name, email, phone, passwordHash });

    loginUser(req, user, "LOCAL");
    req.flash("success", "Registered and logged in successfully!");
    res.redirect("/");   // ⬅ GO DIRECTLY TO HOME
});

// NGO registration handler
router.post("/register/ngo", async (req, res) => {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await NgoUser.create({ name, email, passwordHash, role: "NGO_ADMIN" });

    loginUser(req, user, "NGO");
    req.flash("success", "NGO registered and logged in!");
    res.redirect("/");   // ⬅ GO DIRECTLY TO HOME
});

// ===== LOGIN ROUTES =====

// Local user login form
router.get("/login/local", (req, res) => {
    res.render("auth/loginLocal");
});

// NGO login form
router.get("/login/ngo", (req, res) => {
    res.render("auth/loginNgo");
});

// Local user login handler
router.post("/login/local", async (req, res) => {
    const { email, password } = req.body;
    const user = await LocalUser.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        req.flash("error", "Invalid credentials.");
        return res.redirect("/auth/login/local");
    }

    loginUser(req, user, "LOCAL");
    req.flash("success", `Welcome back, ${user.name}!`);
    res.redirect("/");   // ⬅ GO DIRECTLY TO HOME
});

// NGO login handler
router.post("/login/ngo", async (req, res) => {
    const { email, password } = req.body;
    const user = await NgoUser.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        req.flash("error", "Invalid NGO credentials.");
        return res.redirect("/auth/login/ngo");
    }

    loginUser(req, user, "NGO");
    req.flash("success", `Welcome, ${user.name}!`);
    res.redirect("/");   // ⬅ GO DIRECTLY TO HOME
});

// ===== LOGOUT =====
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
