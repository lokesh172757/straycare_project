const express = require("express");
const router = express.Router();
const { TreatedAnimal, Report } = require("../models");

// GET: Public adoption listing
router.get("/", async (req, res) => {
    try {
        const animals = await TreatedAnimal.find({ adoptable: true });
        res.render("adoption/index", { animals });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading adoption gallery");
    }
});

// GET: Form to mark as adoptable (NGO panel)
router.get("/new", async (req, res) => {
    try {
        const untreated = await TreatedAnimal.find({ adoptable: false });
        res.render("adoption/new", { untreated });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading form");
    }
});

// POST: Mark treated animal as adoptable
router.post("/", async (req, res) => {
    const { animalId, adoptionFee } = req.body;
    try {
        await TreatedAnimal.findByIdAndUpdate(animalId, {
            adoptable: true,
            adoptionFee,
        });
        res.redirect("/adoption");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to mark adoptable") ;
    }
});

// ✅ NEW: GET /adoption/:id — View one adoptable animal's details
router.get("/:id", async (req, res) =>{
    const { id } = req.params;
    try {
        const animal = await TreatedAnimal.findById(id).populate("beforeReportId");

        if (!animal || !animal.adoptable) {
            return res.status(404).send("Animal not found or not adoptable");
        }

        res.render("adoption/show", { animal });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to load animal details");
    }
});
// GET: Contact form for adoption
router.get("/:id/contact", async (req, res) => {
    const { id } = req.params;
    const animal = await TreatedAnimal.findById(id);
    if (!animal || !animal.adoptable) {
        return res.status(404).send("Animal not found or not adoptable.");
    }
    res.render("adopt/contact", { animal });
});

module.exports = router;
