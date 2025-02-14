const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");

require("./config/passport");

// Import routes for various domains
const indexRoutes = require("./routes/index.routes");
const twitterAuthRoutes = require("./routes/twitterAuth.routes");

const errorHandler = require("./middlewares/errorHandler");
const { scheduleTweetSearchJob, schedulellmReplyJob } = require("./cronJobs");
const config = require("./config/config");

// Schedule the tweet search job
scheduleTweetSearchJob();
schedulellmReplyJob();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(
    session({
        secret: config.jwtSecret,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", twitterAuthRoutes);

// API Routes
app.use("/api", indexRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
