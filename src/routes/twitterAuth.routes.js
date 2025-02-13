const express = require("express");
const router = express.Router();
const passport = require("passport");

// Initialize Passport
require("../config/passport");

console.log("Twitter auth routes");
// Initiate authentication with Twitter
router.get("/twitter", passport.authenticate("twitter"));

// Twitter callback
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
