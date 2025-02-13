const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (!statusCode) statusCode = 500;

    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
