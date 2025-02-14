const fetch = require("node-fetch");

class Twitter {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
  }

  async postReply(replyText, tweetId) {
    try {
      const url = "https://api.twitter.com/2/tweets";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.bearerToken}`,
        },
        body: JSON.stringify({
          text: replyText,
          reply: { in_reply_to_tweet_id: tweetId },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Twitter API Error: ${JSON.stringify(data)}`);
      }

      return data;
    } catch (error) {
      console.error("Error posting reply:", error);
      throw error;
    }
  }
}

module.exports = Twitter;
