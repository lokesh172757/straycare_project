// routes/user.js
const express = require("express");
const router = express.Router();
const { isLoggedIn, isLocalUser } = require("../middleware/auth");
const { Report } = require("../models");

// Local User Dashboard
router.get("/dashboard", isLoggedIn, isLocalUser, async (req, res) => {
    console.log("UserID:", req.session.userId);
    console.log("UserKind:", req.session.userKind);

    const reports = await Report.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.render("user/dashboard", { reports });
});

module.exports = router;
