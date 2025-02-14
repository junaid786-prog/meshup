const axios = require("axios");
const config = require("../config/config");

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