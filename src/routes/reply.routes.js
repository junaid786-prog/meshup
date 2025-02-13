const express = require("express");
const router = express.Router();
const replyController = require("../controllers/reply.controller");

router.post("/generate", replyController.generateReply);
router.get("/", replyController.getReplies);

module.exports = router;
