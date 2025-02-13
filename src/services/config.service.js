let configData = {
    searchInterval: "6h",
    defaultPrompt: "Generate a friendly marketing reply."
  };
  
  exports.getConfig = async () => {
    return configData;
  };
  
  exports.updateConfig = async (newConfig) => {
    configData = { ...configData, ...newConfig };
    return configData;
  };
  