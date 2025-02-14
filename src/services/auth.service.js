const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const userService = require("./user.service");
const config = require("../config/config");

exports.signup = async (userData) => {
  const existingUser = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const newUser = await userService.createUser(userData);
  const token = jwt.sign({ id: newUser._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
  return { user: newUser, token };
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
  return { token, user };
};
exports.logout = async () => {
  return { message: "User logged out successfully" };
};

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
}
