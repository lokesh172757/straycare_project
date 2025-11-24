const express = require("express");
const router = express.Router();
const { TreatedAnimal, AdoptionRequest } = require("../models");

// GET: Show adoption contact form
router.get("/:id/contact", async (req, res) =>{
    const { id } = req.params;
    const animal = await TreatedAnimal.findById(id);
    if (!animal || !animal.adoptable) {
        return res.status(404).send("Animal not found or not adoptable.");
    }
    res.render("adopt/contact", { animal });
});

// ✅ POST: Handle form submission
router.post("/:id/contact", async (req, res) => {
    const { id } = req.params;
    const { name, phone, message } = req.body;

    await AdoptionRequest.create({
        animalId: id,
        name,
        phone,
        message
    });

    res.send("✅ Your interest has been submitted!");
    // (optional) redirect to thank you or homepage
});

module.exports = router;
