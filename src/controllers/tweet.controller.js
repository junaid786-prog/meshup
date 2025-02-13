const Tweet = require("../models/tweet");
const tweetService = require("../services/tweet.service");
const { sendResponse } = require("../utils/responseHandler");

exports.searchTweets = async (req, res, next) => {
  try {
    const { keywords } = req.query;
    const tweets = await tweetService.fetchTweetsFromTwitter(keywords);
    sendResponse(res, 200, { tweets });
  } catch (error) {
    next(error);
  }
};

exports.getTweetById = async (req, res, next) => {
  try {
    const tweet = await Tweet.findOne({ tweetId: req.params.id }).populate("llmReply");
    sendResponse(res, 200, { tweet });
  } catch (error) {
    next(error);
  }
};

exports.createTweet = async (req, res, next) => {
  try {
    const tweet = new Tweet(req.body);
    await tweet.save();
    sendResponse(res, 201, { tweet });
  } catch (error) {
    next(error);
  }
};
