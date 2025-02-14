const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    searchInterval: { type: String, default: "6h" },
    defaultPrompt: { type: String, default: "Generate a friendly marketing reply." },
    defaultKeywords: { type: String, default: "marketing" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
