const express = require("express");
const router = express.Router();
const { Report } = require("../models");

// GET: Report form
router.get("/new", (req, res) => {
    res.render("report"); // views/report.ejs
});

// POST: Create new report
router.post("/", async (req, res) => {
    const { photoUrl, lat, lng, description, donationIntent, userId } = req.body;

    const report = new Report({
        photoUrl,
        location: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        description,
        donationIntent,
        userId,
    });

    await report.save();
    res.redirect("/");
});

module.exports = router;
