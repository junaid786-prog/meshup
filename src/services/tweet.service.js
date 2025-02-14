const fetch = require("node-fetch"); // For Node versions < 18, otherwise use global fetch
const config = require("../config/config");
const Tweet = require("../models/tweet");

exports.fetchTweetsFromTwitter = async (keywords, nextToken = "") => {
  try {
    const response = await fetch(
      "https://api.twitter.com/2/tweets/search/recent?query=" + keywords,
      {
        headers: {
          Authorization: "Bearer " + config.twitterBearerToken,
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error fetching tweets: " + error.message);
  }
};

exports.getTweets = async (userId) => {
  return await Tweet.find({ user: userId });
};

exports.getTweetById = async (tweetId) => {
  return await Tweet.findOne({ tweetId }).populate("llmReply");
};

exports.createTweet = async (tweetData) => {
  return await Tweet.create(tweetData);
};
