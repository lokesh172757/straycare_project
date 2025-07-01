const express = require("express");
const router = express.Router();
const { TreatedAnimal } = require("../models");

// Homepage route (optional)
router.get("/", (req, res) => {
    res.render("home"); // change to your homepage view if needed
});

// ✅ Treated Animals route
router.get("/treated", async (req, res) => {
    try {
        const animals = await TreatedAnimal.find({});
        res.render("treated/index", { animals });
    } catch (err) {
        console.error("Error in /treated route:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
