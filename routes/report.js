const express = require("express");
const router = express.Router();
const { Report } = require("../models");
const { isLoggedIn, isLocalUser } = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET: Show report form (local user)
router.get("/new", isLoggedIn, isLocalUser, (req, res) => {
    res.render("report"); // views/report.ejs
});

// POST: Create a new report
router.post("/", isLoggedIn, isLocalUser, upload.single("photo"), async (req, res) => {
    const { lat, lng, description, donationIntent } = req.body;
    const photoUrl = "/uploads/" + req.file.filename;

    const report = new Report({
        photoUrl,
        location: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        description,
        donationIntent,
        userId: req.session.userId
    });

    await report.save();
    res.redirect("/user/dashboard");
});

// GET: View report details (open to all)
// GET: View report details (open to all)
router.get("/:id", async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate("treatedAnimalId")
            .populate("userId");

        if (!report) {
            return res.status(404).send("Report not found");
        }

        res.render("report/show", { report });  // ✅ Fixed path
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;
