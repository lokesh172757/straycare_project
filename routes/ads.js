// routes/ads.js
const express = require("express");
const router = express.Router();
const { Ad } = require("../models");

// ====== List / Manage Ads (GET /ads) ======
router.get("/", async (req, res) => {
    const ads = await Ad.find({}).sort({ startsOn: -1 });
    res.render("ads/index", { ads });
});

// ====== Create Ad (POST /ads) ======
router.post("/", async (req, res) => {
    const { shopName, logoUrl, link, startsOn, endsOn } = req.body;

    // Convert to Date objects so EJS date formatting never fails
    await Ad.create({
        shopName,
        logoUrl,
        link,
        startsOn: new Date(startsOn),
        endsOn: new Date(endsOn)
    });

    req.flash("success", "Ad created!");
    res.redirect("/ads");
});

// ====== Delete Ad (DELETE /ads/:id) ======
router.delete("/:id", async (req, res) => {
    await Ad.findByIdAndDelete(req.params.id);
    req.flash("success", "Ad deleted.");
    res.redirect("/ads");
});

module.exports = router;
