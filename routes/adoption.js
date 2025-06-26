const express = require("express");
const router = express.Router();
const { TreatedAnimal } = require("../models");

// GET: Public adoption listing
router.get("/", async (req, res) => {
    const animals = await TreatedAnimal.find({ adoptable: true });
    res.render("adoption/index", { animals });
});

// GET: Form to mark as adoptable
router.get("/new", async (req, res) => {
    const untreated = await TreatedAnimal.find({ adoptable: false });
    res.render("adoption/new", { untreated });
});

// POST: Mark treated animal as adoptable
router.post("/", async (req, res) => {
    const { animalId, adoptionFee } = req.body;
    await TreatedAnimal.findByIdAndUpdate(animalId, {
        adoptable: true,
        adoptionFee,
    });
    res.redirect("/adoption");
});

module.exports = router;
