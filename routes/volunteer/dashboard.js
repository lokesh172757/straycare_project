exports.isVolunteer = (req, res, next) => {
    if (req.session.userKind !== "VOLUNTEER") {
        return res.status(403).send("Only volunteers can access this.");
    }
    next();
};
