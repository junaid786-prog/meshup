const configService = require("../services/config.service");
const { sendResponse } = require("../utils/responseHandler");

exports.getConfig = async (req, res, next) => {
  try {
    const config = await configService.getConfig();
    sendResponse(res, 200, { config });
  } catch (error) {
    next(error);
  }
};

exports.updateConfig = async (req, res, next) => {
  try {
    const updatedConfig = await configService.updateConfig(req.body);
    sendResponse(res, 200, { message: "Configuration updated", config: updatedConfig });
  } catch (error) {
    next(error);
  }
};
