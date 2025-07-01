// routes/treatment.js
const express = require("express");
const router = express.Router();
const { Report, TreatedAnimal } = require("../models");
const { isLoggedIn } = require("../middleware/auth");

// Check NGO Role
const isNGO = (req, res, next) => {
    if (req.user?.role === "NGO_ADMIN" || req.user?.role === "VOLUNTEER") return next();
    return res.status(403).send("Access denied: NGO only");
};

// POST /treatment/:reportId - mark report as treated
router.post("/:reportId", isLoggedIn, isNGO, async (req, res) => {
    try {
        const { reportId } = req.params;
        const { afterPhotoUrl, healthNotes, adoptable, adoptionFee } = req.body;

        const report = await Report.findById(reportId);
        if (!report) return res.status(404).send("Report not found");

        if (report.status === "TREATED") {
            return res.status(400).send("This report is already marked as treated.");
        }

        // Create TreatedAnimal entry
        const treated = await TreatedAnimal.create({
            beforeReportId: report._id,
            afterPhotoUrl,
            healthNotes,
            adoptable: adoptable === "true" || adoptable === true,
            adoptionFee: Number(adoptionFee) || 0,
        });

        // Update original report
        report.status = "TREATED";
        report.treatedAnimalId = treated._id;
        await report.save();

        res.status(201).json({
            message: "Animal marked as treated successfully.",
            treatedAnimal: treated,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
