const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Optionally store the Twitter handle for cross-referencing
  twitterHandle: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  metaData: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    tweets: { type: Number, default: 0 },
  },
  displayName: {
    type: String
  },
  profileImage: { 
    type: String 
  },
  twitterOAuthToken: { 
    type: String 
  },
  twitterOAuthSecret: { 
    type: String 
  },
});

module.exports = mongoose.model('User', userSchema);
