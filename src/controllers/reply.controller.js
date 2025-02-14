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

exports.postReplyToTweet = async (req, res, next) => {
  try {
    const tweetId = "1890211060164239759"
    const replyId = "67ae9c2233d0d822a30a47aa";
    console.log(tweetId, replyId, req.body);
    
    const reply = await Reply.findById(replyId);
    if (!reply || !tweetId) {
      sendResponse(res, 404, { message: "Reply not found" });
    }
    await replyService.postReplyToTwitter(replyId, req.user.id);
    // reply.tweet = tweetId;
    reply.isPublished = true;
    await reply.save();
    sendResponse(res, 200, { message: "Reply posted to tweet" });
  }
  catch (error) {
    next(error);
  }
}
