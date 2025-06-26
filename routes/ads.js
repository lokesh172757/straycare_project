const express = require("express");
const router = express.Router();
const { Ad } = require("../models");

// GET: show all ads
router.get("/", async (req, res) => {
    const ads = await Ad.find({});
    res.render("ads/index", { ads });
});

// GET: show form to add new ad
router.get("/new", (req, res) => {
    res.render("ads/new");
});

// POST: create a new ad
router.post("/", async (req, res) => {
    const { shopName, logoUrl, link } = req.body;
    await Ad.create({ shopName, logoUrl, link });
    res.redirect("/ads");
});

module.exports = router;
