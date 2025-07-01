const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const VolunteerUser = require("../../models/VolunteerUser");

// Register
router.get("/register", (req, res) => {
    res.render("volunteer/register");
});

router.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const newUser = await VolunteerUser.create({ name, email, phone, passwordHash });
        req.session.userId = newUser._id;
        req.session.userKind = "VOLUNTEER";
        req.session.userName = newUser.name;
        res.redirect("/volunteer/dashboard");
    } catch (err) {
        console.error(err);
        res.send("Error registering user.");
    }
});

// Login
router.get("/login", (req, res) => {
    res.render("volunteer/login");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const volunteer = await VolunteerUser.findOne({ email });

    if (!volunteer) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, volunteer.passwordHash);
    if (!isMatch) return res.send("Invalid credentials");

    req.session.userId = volunteer._id;
    req.session.userKind = "VOLUNTEER";
    req.session.userName = volunteer.name;
    res.redirect("/volunteer/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/volunteer/login");
    });
});

module.exports = router;
