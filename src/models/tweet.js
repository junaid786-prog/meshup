const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  tweetId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  authorId: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  publicMetrics: {
    retweet_count: { type: Number, default: 0 },
    reply_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    quote_count: { type: Number, default: 0 }
  },
  // Reference to a Reply document (if generated)
  llmReply: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Reply" 
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);
