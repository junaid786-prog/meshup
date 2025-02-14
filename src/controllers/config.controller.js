const configService = require("../services/config.service");
const { sendResponse } = require("../utils/responseHandler");

exports.getConfig = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const config = await configService.getConfig(userId);
    sendResponse(res, 200, { config });
  } catch (error) {
    next(error);
  }
};

exports.updateConfig = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedConfig = await configService.updateConfig(userId, req.body);
    sendResponse(res, 200, { message: "Configuration updated", config: updatedConfig });
  } catch (error) {
    next(error);
  }
};
