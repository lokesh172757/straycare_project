const express = require("express");
const router = express.Router();
const { Report, TreatedAnimal } = require("../models");

// GET all open reports
router.get("/reports", async (req, res) => {
    const reports = await Report.find({ status: "OPEN" });
    res.render("ngo/openReports", { reports });
});

// GET form to mark as treated
router.get("/treat/:id", async (req, res) => {
    const report = await Report.findById(req.params.id);
    res.render("ngo/treatForm", { report });
});

// POST: Mark as treated
router.post("/treat/:id", async (req, res) => {
    const { afterPhotoUrl, healthNotes, adoptable, adoptionFee } = req.body;
    const reportId = req.params.id;

    const treatedAnimal = await TreatedAnimal.create({
        beforeReportId: reportId,
        afterPhotoUrl,
        healthNotes,
        adoptable: adoptable === "on",
        adoptionFee: adoptionFee || 0
    });

    await Report.findByIdAndUpdate(reportId, {
        status: "TREATED",
        treatedAnimalId: treatedAnimal._id
    });

    res.redirect("/ngo/reports");
});

module.exports = router;
