const axios = require("axios");
const config = require("../config/config");

exports.fetchTweetsFromTwitter = async (keywords) => {
  console.log(config.twitterBearerToken);
  
  try {
    const response = await axios.get("https://api.twitter.com/2/tweets/search/recent", {
      params: {
        query: keywords,
        max_results: 10,
        "tweet.fields": "author_id,created_at"
      },
      headers: {
        Authorization: `Bearer ${config.twitterBearerToken}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching tweets from Twitter: " + error.message);
  }
};
