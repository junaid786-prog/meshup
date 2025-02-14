const { TwitterApi } = require('twitter-api-v2');
const User = require('../models/user');
const config = require('../config/config');
const Reply = require('../models/reply');

class ReplyService {
    constructor() {
        this.twitterClient = null;
    }

    async initializeClient(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            console.log(userId, {
                appKey: config.twitterConsumerKey,
                appSecret: config.twitterConsumerSecret,
                accessToken: user.twitterOAuthToken,
                accessSecret: user.twitterOAuthSecret,
            });

            // Initialize Twitter client with user's OAuth tokens
            this.twitterClient = new TwitterApi({
                appKey: config.twitterConsumerKey,
                appSecret: config.twitterConsumerSecret,
                accessToken: user.twitterOAuthToken,
                accessSecret: user.twitterOAuthSecret,
            });

            return this.twitterClient;
        } catch (error) {
            console.error('Error initializing Twitter client:', error);
            throw error;
        }
    }

    async replyToTweet(userId, tweetId, replyText, replyId) {
        try {
            let reply = await Reply.findById(replyId).populate("tweet");
            if (!reply) throw new Error("Reply not found");
            // Initialize client if not already initialized
            if (!this.twitterClient) {
                await this.initializeClient(userId);
            }

            // Post the reply
            const response = await this.twitterClient.v2.reply(
                replyText,
                tweetId,
            );

            reply.isPublished = true;
            await reply.save();
            return response.data;
        } catch (error) {
            console.error('Error posting reply:', error);
            throw error;
        }
    }
}

module.exports = new ReplyService();