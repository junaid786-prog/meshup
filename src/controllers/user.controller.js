const userService = require("../services/user.service");
const { sendResponse } = require("../utils/responseHandler");

exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    sendResponse(res, 201, { user: newUser });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    sendResponse(res, 200, { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    sendResponse(res, 200, { message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
