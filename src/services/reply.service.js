const axios = require("axios");
const config = require("../config/config");
const User = require("../models/user");
const Reply = require("../models/reply");
const Twitter = require("../utils/twitterClient");


exports.generateReplyForTweet = async (tweetContent, prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: tweetContent }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${config.llmApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.dir(response.data, { depth: null });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error("Error generating reply: " + error.message);
  }
};

exports.createReply = async (replyData) => {
  return await Reply.create(replyData);
};

exports.getReplies = async () => {
  return await Reply.find({});
};

// exports.postReplyToTwitter = async (replyId) => {
//   try {
//     const reply = await Reply.findById(replyId).populate("tweet");
//     if (!reply) throw new Error("Reply not found");

//     const twitterClient = new Twitter(config.twitterBearerToken);
//     const response = await twitterClient.postReply(reply.replyText, reply.tweet.tweetId);

//     if (response.data) {
//       reply.postedToTwitter = true;
//       await reply.save();
//       return { success: true, message: "Reply posted successfully!", tweetId: response.data.id };
//     } else {
//       throw new Error("Failed to post reply.");
//     }
//   } catch (error) {
//     console.error("Error posting reply:", error);
//     throw new Error("Could not post reply to Twitter.");
//   }
// };
exports.postReplyToTwitter = async (replyId, userId) => {
  try {
    // 🔍 Find reply & associated tweet
    const reply = await Reply.findById(replyId).populate("tweet");
    if (!reply) throw new Error("Reply not found");

    // 🔍 Fetch user Twitter credentials
    const user = await User.findById(userId);
    if (!user || !user.twitterOAuthToken || !user.twitterOAuthSecret) {
      throw new Error("User Twitter credentials not found.");
    }

    // 📝 Post reply via Twitter API
    const tweetData = {
      status: reply.replyText,
      in_reply_to_status_id: reply.tweet.tweetId,
    };

    const twitterClient = new Twitter(user.twitterOAuthToken, user.twitterOAuthSecret);
    const response = await twitterClient.postReply(tweetData);

    if (response.id_str) {
      reply.postedToTwitter = true;
      await reply.save();
      return { success: true, message: "Reply posted successfully!" };
    } else {
      throw new Error("Failed to post reply.");
    }
  } catch (error) {
    console.error("Error posting reply:", error);
    throw new Error("Could not post reply to Twitter.");
  }
};

exports.postReplyToTweet = async (tweetId, replyText) => {
  try {
    const response = await axios.post(
      `https://api.twitter.com/1.1/statuses/update.json?status=${encodeURIComponent(replyText)}&in_reply_to_status_id=${tweetId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${config.twitterBearerToken}`
        }
      }
    );
    console.log("Tweeted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error posting reply:", error);
    throw new Error("Error posting reply: " + error.message);
  }
};