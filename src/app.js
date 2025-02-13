const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// Import routes for various domains
const indexRoutes = require("./routes/index.routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// API Routes
app.use("/api", indexRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
