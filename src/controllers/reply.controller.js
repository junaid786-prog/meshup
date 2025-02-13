const Reply = require("../models/reply");
const replyService = require("../services/reply.service");
const { sendResponse } = require("../utils/responseHandler");

exports.generateReply = async (req, res, next) => {
  try {
    const { tweetId, tweetContent, prompt } = req.body;
    const replyText = await replyService.generateReplyForTweet(tweetContent, prompt);
    const newReply = await Reply.create({
      tweet: tweetId,
      replyText,
      promptUsed: prompt
    });
    sendResponse(res, 200, { reply: newReply });
  } catch (error) {
    next(error);
  }
};

exports.getReplies = async (req, res, next) => {
  try {
    const replies = await Reply.find({});
    sendResponse(res, 200, { replies });
  } catch (error) {
    next(error);
  }
};
