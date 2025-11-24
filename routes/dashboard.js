const express = require("express");
const router = express.Router();
const {
    LocalUser,
    NgoUser,
    Report,
    TreatedAnimal,
    AdoptionRequest
} = require("../models/index.js");

// Middleware (placeholder — replace with your real auth system)
function isLoggedIn(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

function isLocalUser(req, res, next) {
    if (req.session.userType !== "local") {
        return res.status(403).send("Access Denied: Local Users Only");
    }
    next();
}

function isNgoUser(req, res, next) {
    if (req.session.userType !== "ngo") {
        return res.status(403).send("Access Denied: NGO Users Only");
    }
    next();
}

// =======================
// Local user dashboard
// =======================
router.get("/local/dashboard", isLoggedIn, isLocalUser, async (req, res) => {
    try {
        const userId = req.session.userId;

        const myReports = await Report.find({ userId });
        const myAdoptionRequests = await AdoptionRequest.find({ phone: req.session.userPhone });

        res.render("dashboard/local", { myReports, myAdoptionRequests });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
// this is ngo dashboard
// =======================
// NGO DASHBOARD
// =======================
router.get("/ngo/dashboard", isLoggedIn, isNgoUser, async (req, res) => {
    try {
        const allReports = await Report.find({}).populate("userId");
        const treatedAnimals = await TreatedAnimal.find({}).populate("beforeReportId");
        const adoptionRequests = await AdoptionRequest.find({}).populate("animalId");

        res.render("dashboard/ngo", { allReports, treatedAnimals, adoptionRequests });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
