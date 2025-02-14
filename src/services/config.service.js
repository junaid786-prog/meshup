const Config = require("../models/config.js");

exports.getConfig = async (userId) => {
  let config = await Config.findOne({ user: userId });
  if (!config) {
    config = await Config.create({ user: userId });
  }
  return config;
};

exports.updateConfig = async (userId, newConfig) => {
  const config = await Config.findOneAndUpdate(
    { user: userId },
    newConfig,
    { new: true, upsert: true }
  );
  return config;
};
