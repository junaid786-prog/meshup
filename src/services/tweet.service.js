const axios = require("axios");
const config = require("../config/config");

exports.fetchTweetsFromTwitter = async (keywords) => {
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
