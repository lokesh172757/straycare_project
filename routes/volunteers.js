// routes/volunteers.js
const express = require("express");
const router = express.Router();
const { VolunteerRequest, Report } = require("../models");
const { isLoggedIn, isNGO } = require("../middleware/auth");

// API: Assign volunteer using reportId directly (POST /volunteers/assign/:reportId)
router.post("/assign/:reportId", isLoggedIn, isNGO, async (req, res) => {
    try {
        const { reportId } = req.params;
        const { volunteerName, volunteerPhone, notes } = req.body;

        const report = await Report.findById(reportId);
        if (!report) return res.status(404).send("Report not found");

        if (!["OPEN", "IN_PROGRESS"].includes(report.status)) {
            return res.status(400).send("Report is already closed");
        }

        const assignment = await VolunteerRequest.create({
            reportId,
            ngoId: req.session.userId,
            volunteerName,
            volunteerPhone,
            notes,
        });

        report.status = "IN_PROGRESS";
        await report.save();

        res.status(201).json({ message: "Volunteer assigned", assignment });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

// API: View all volunteer assignments for logged-in NGO (GET /volunteers/my-assignments)
router.get("/my-assignments", isLoggedIn, isNGO, async (req, res) => {
    try {
        const assignments = await VolunteerRequest.find({ ngoId: req.session.userId })
            .populate("reportId")
            .sort({ assignedAt: -1 });

        res.json(assignments);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

// Web: Show assignment form (GET /volunteers/assign)
router.get("/assign", isLoggedIn, isNGO, async (req, res) => {
    try {
        const reports = await Report.find({
            status: { $in: ["OPEN", "IN_PROGRESS"] }
        }).sort({ createdAt: -1 });

        res.render("ngo/assign-form", { reports });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading report list");
    }
});

// Web: Handle form submission (POST /volunteers/assign)
router.post("/assign", isLoggedIn, isNGO, async (req, res) => {
    try {
        const { reportId, volunteerName, volunteerPhone, notes } = req.body;

        const report = await Report.findById(reportId);
        if (!report) return res.status(404).send("Report not found");

        if (!["OPEN", "IN_PROGRESS"].includes(report.status)) {
            return res.status(400).send("Report is already closed");
        }

        await VolunteerRequest.create({
            reportId,
            ngoId: req.session.userId,
            volunteerName,
            volunteerPhone,
            notes,
        });

        report.status = "IN_PROGRESS";
        await report.save();

        req.flash("success", "Volunteer assigned successfully");
        res.redirect("/volunteers/view");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

// Web: View all assignments (GET /volunteers/view)
router.get("/view", isLoggedIn, isNGO, async (req, res) => {
    try {
        const assignments = await VolunteerRequest.find({ ngoId: req.session.userId })
            .populate("reportId")
            .sort({ assignedAt: -1 });

        res.render("ngo/assignments", { assignments });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading assignments");
    }
});

module.exports = router;
