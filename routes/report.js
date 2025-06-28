const express = require("express");
const router = express.Router();
const { Report } = require("../models");
const { isLoggedIn, isLocalUser } = require("../middleware/auth");

// GET: Show report form (only for logged-in local users)
router.get("/new", isLoggedIn, isLocalUser, (req, res) => {
    res.render("report"); // views/report.ejs
});

// POST: Submit new report (only for logged-in local users)
router.post("/", isLoggedIn, isLocalUser, async (req, res) => {
    const { photoUrl, lat, lng, description, donationIntent } = req.body;

    const report = new Report({
        photoUrl,
        location: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        description,
        donationIntent,
        userId: req.session.userId, // ✅ gets from session
    });

    await report.save();
    res.redirect("/");
});

// GET: View single report details (open to anyone)
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id)
            .populate("treatedAnimalId")
            .populate("userId");

        if (!report) {
            return res.status(404).send("Report not found");
        }

        res.render("reports/show", { report }); // ✅ You'll need views/reports/show.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
