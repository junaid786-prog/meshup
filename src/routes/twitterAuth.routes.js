const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
require("../config/passport");

router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: `${config.frontendUrl}/login` }),
  (req, res) => {
    // After successful authentication, req.user is available
    // Generate JWT token for the user
    console.log("user: ", req.user);
    
    const token = jwt.sign({ id: req.user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    });
    // Redirect to frontend login success page with token as query parameter
    res.redirect(`${config.frontendUrl}/login-success?token=${token}`);
  }
);

module.exports = router;
