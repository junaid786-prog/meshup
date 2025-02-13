// src/utils/responseHandler.js
const sendResponse = (res, status, data) => {
    res.status(status).json({
      success: status >= 200 && status < 300,
      ...data,
    });
  };
  
  module.exports = { sendResponse };
  