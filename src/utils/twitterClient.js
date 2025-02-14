const OAuth = require("oauth").OAuth;
const config = require("../config/config");

class Twitter {
  constructor(oauthToken, oauthTokenSecret) {
    this.oauthToken = oauthToken;
    this.oauthTokenSecret = oauthTokenSecret;

    this.oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      config.twitterConsumerKey,
      config.twitterConsumerSecret,
      "1.0A",
      null,
      "HMAC-SHA1"
    );
  }

  postReply(tweetData) {
    return new Promise((resolve, reject) => {
      const url = `https://api.twitter.com/1.1/statuses/update.json`;
      this.oauth.post(
        url,
        this.oauthToken,
        this.oauthTokenSecret,
        tweetData,
        (err, data) => {
          if (err) return reject(err);
          resolve(JSON.parse(data));
        }
      );
    });
  }
}

module.exports = Twitter;
