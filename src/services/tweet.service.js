const axios = require("axios");
const config = require("../config/config");
const tweet = require("../models/tweet");

/**
 * tweet.fields
enum<string>[]
A comma separated list of Tweet fields to display.
Available options: article, attachments, author_id, card_uri, community_id, context_annotations, conversation_id, created_at, display_text_range, edit_controls, edit_history_tweet_ids, entities, geo, id, in_reply_to_user_id, lang, media_metadata, non_public_metrics, note_tweet, organic_metrics, possibly_sensitive, promoted_metrics, public_metrics, referenced_tweets, reply_settings, scopes, source, text, withheld 
 */
exports.fetchTweetsFromTwitter = async (keywords, nextToken) => {
  try {
    const response = await fetch(
      "https://api.twitter.com/2/tweets/search/recent?query=" + keywords + "&max_results=100&tweet.fields=author_id,created_at,public_metrics,text,username,organic_metrics&next_token=" + nextToken,
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

exports.getTweets = async () => {
  return await tweet.find({});
}

exports.getTweetById = async (tweetId) => {
  return await tweet.findOne({ tweetId }).populate("llmReply");
}

exports.createTweet = async (tweetData) => {
  return await tweet.create(tweetData);
}
