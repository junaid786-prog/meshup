const axios = require("axios");
const config = require("../config/config");

exports.generateReplyForTweet = async (tweetContent, prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: tweetContent }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${config.llmApiKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.dir(response.data, { depth: null });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error("Error generating reply: " + error.message);
  }
};
