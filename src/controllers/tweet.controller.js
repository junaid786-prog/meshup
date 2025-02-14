const Tweet = require("../models/tweet");
const tweetService = require("../services/tweet.service");
const { sendResponse } = require("../utils/responseHandler");

exports.searchTweets = async (req, res, next) => {
  try {
    const { keywords, nextToken } = req.query;
    const tweets = await tweetService.fetchTweetsFromTwitter(keywords, nextToken);
    sendResponse(res, 200, { tweets });
  } catch (error) {
    next(error);
  }
};

exports.getTweets = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tweets = await tweetService.getTweets(userId);
    sendResponse(res, 200, { tweets });
  } catch (error) {
    next(error);
  }
};

exports.getTweetById = async (req, res, next) => {
  try {
    const tweet = await tweetService.getTweetById(req.params.id);
    sendResponse(res, 200, { tweet });
  } catch (error) {
    next(error);
  }
};

exports.createTweet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Attach the logged-in user's ID to the tweet data
    const tweetData = { ...req.body, user: userId };
    const tweet = await tweetService.createTweet(tweetData);
    sendResponse(res, 201, { tweet });
  } catch (error) {
    next(error);
  }
};
