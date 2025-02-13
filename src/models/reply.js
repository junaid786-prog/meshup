const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  // Link back to the tweet
  tweet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tweet", 
    required: true 
  },
  replyText: { 
    type: String, 
    required: true 
  },
  generatedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Optional field to log the prompt used for generating this reply
  promptUsed: { 
    type: String 
  }
});

module.exports = mongoose.model('Reply', replySchema);
