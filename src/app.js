const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
require("./config/passport");

// Import routes for various domains
const indexRoutes = require("./routes/index.routes");
const twitterAuthRoutes = require("./routes/twitterAuth.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(passport.initialize());

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// API Routes
app.use("/api", indexRoutes);
app.use("/api/auth", twitterAuthRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
