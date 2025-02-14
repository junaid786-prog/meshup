const authService = require("../services/auth.service");
const { sendResponse } = require("../utils/responseHandler");

exports.signup = async (req, res, next) => {
  try {
    // Call the auth service to handle signup
    const { user, token } = await authService.signup(req.body);
    sendResponse(res, 201, { user, token });
  } catch (error) {
    next(error);
  }
};

// Existing functions:
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await authService.login(username, password);
    sendResponse(res, 200, { token, user });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  // For stateless JWT authentication, logout is usually handled on the client side
  sendResponse(res, 200, { message: "User logged out successfully" });
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    sendResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};