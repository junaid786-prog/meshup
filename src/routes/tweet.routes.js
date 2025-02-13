const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweet.controller");

router.get("/search-tweets", tweetController.searchTweets);
router.get("/:id", tweetController.getTweetById);
router.post("/", tweetController.createTweet);

module.exports = router;
