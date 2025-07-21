const express = require("express");
const router = express.Router();
const { Report, TreatedAnimal, AdoptionRequest } = require("../models");
const upload = require("../middleware/upload");

// NGO Dashboard (Overview)
router.get("/dashboard", async (req, res) => {
    const totalReports = await Report.countDocuments({});
    const openReports = await Report.countDocuments({ status: "OPEN" });
    const treatedAnimals = await TreatedAnimal.countDocuments({});
    const adoptionRequests = await AdoptionRequest.countDocuments({});

    res.render("ngo/dashboard", {
        totalReports,
        openReports,
        treatedAnimals,
        adoptionRequests
    });
});

//  GET all open reports
router.get("/reports", async (req, res) => {
    const reports = await Report.find({ status: "OPEN" });
    res.render("ngo/openReports", { reports });
});

//  GET form to mark animal as treated
router.get("/treat/:id", async (req, res) => {
    const report = await Report.findById(req.params.id);
    res.render("ngo/treatForm", { report });
});

// POST: Mark animal as treated (with image upload)
router.post("/treat/:id", upload.single("afterPhoto"), async (req, res) => {
    const { healthNotes, adoptable, adoptionFee } = req.body;
    const reportId = req.params.id;

    const afterPhotoUrl = "/uploads/" + req.file.filename;

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

//  NEW: View all adoption requests
router.get("/adoptions", async (req, res) => {
    const requests = await AdoptionRequest.find({})
        .populate("animalId")
        .sort({ createdAt: -1 });

    res.render("ngo/adoptions", { requests });
});

//  DELETE: Remove an adoption request
router.delete("/adoptions/:id", async (req, res) => {
    await AdoptionRequest.findByIdAndDelete(req.params.id);
    res.redirect("/ngo/adoptions");
});

//  View all treated animals
router.get("/treated", async (req, res) => {
    try {
        const treatedAnimals = await TreatedAnimal.find().sort({ createdAt: -1 });
        res.render("ngo/treatedAnimals", { treatedAnimals });
    } catch (err) {
        console.error("Treated route error:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
