const cron = require("node-cron");
const tweetService = require("./services/tweet.service");
const jobService = require("./services/job.service");
const configService = require("./services/config.service");
const config = require("./config/config");
const tweet = require("./models/tweet");

exports.scheduleTweetSearchJob = () => {
  // Use a schedule of every minute in development, every 1 minute in production
  const scheduleExpression = config.nodeEnv === "development" ? "* * * * *" : "0 * * * *";
  console.log(`Setting up tweet search cron job with schedule: "${scheduleExpression}"`);

  cron.schedule(scheduleExpression, async () => {
    console.log("🚀 Cron job triggered at", new Date().toISOString());
    const jobName = "tweetSearch";
    try {
      let job = await jobService.getJobByName(jobName);
      const now = new Date();
      if (!job) {
        job = await jobService.createJob({
          jobName,
          status: "running",
          lastRun: now,
          nextRun: new Date(now.getTime() + 6 * 60 * 60 * 1000)
        });
        console.log("Created new job record:", job);
      } else {
        job = await jobService.updateJob(job._id, { status: "running", lastRun: now });
        console.log("Updated job record to running:", job);
      }

      // Get configuration settings for keywords
      const config = await configService.getConfig();
      const keywords = config.defaultKeywords || "marketing";
      console.log("Using keywords:", keywords);

      const tweetsData = await tweetService.fetchTweetsFromTwitter(keywords, job.metaData?.data?.next_token);
      console.log("Fetched tweets:", tweetsData);

      // Save tweets to database
      const tweets = tweetsData.data.map(mapTweetData);
      tweet.insertMany(tweets);
      const nextRun = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      await jobService.updateJob(job._id,
        {
          status: "scheduled", nextRun, metaData: {
            data: {
              next_token: tweetsData.meta.next_token
            }
          }
        });
      console.log("Job updated to scheduled. Next run at", nextRun.toISOString());
    } catch (error) {
      console.error("Scheduled job error:", error);
      // Optionally update job status to failed if needed
      try {
        const job = await jobService.getJobByName(jobName);
        if (job) {
          await jobService.updateJob(job._id, { status: "failed" });
          console.log("Job updated to failed status");
        }
      } catch (err) {
        console.error("Error updating job status:", err);
      }
    }
  });
};

exports.schedulellmReplyJob = () => {
  // For testing, run every minute in development; adjust production schedule as needed.
  const scheduleExpression = config.nodeEnv === "development" ? "* * * * *" : "0 * * * *";
  console.log(`Setting up LLM Reply Cron job with schedule: "${scheduleExpression}"`);

  cron.schedule(scheduleExpression, async () => {
    console.log("🚀 LLM Reply Cron job triggered at", new Date().toISOString());
    const jobName = "llmReplyGeneration";
    try {
      let job = await jobService.getJobByName(jobName);
      const now = new Date();
      if (!job) {
        job = await jobService.createJob({
          jobName,
          status: "running",
          lastRun: now,
          nextRun: new Date(now.getTime() + 1 * 60 * 60 * 1000)
        });
        console.log("Created new LLM job record:", job);
      } else {
        job = await jobService.updateJob(job._id, { status: "running", lastRun: now });
        console.log("Updated LLM job record to running:", job);
      }

      // Find tweets without an LLM reply
      const tweets = await tweet.find({ llmReply: { $exists: false } });
      console.log(`Found ${tweets.length} tweets without LLM reply`);

      // For each tweet, generate a reply and update the tweet document
      const replyService = require("./services/reply.service");
      for (const tweet of tweets) {
        const conf = await configService.getConfig();
        const prompt = conf.defaultPrompt || "Generate a friendly marketing reply.";
        const replyText = await replyService.generateReplyForTweet(tweet.text, prompt);
        const Reply = require("./models/reply");
        const newReply = await Reply.create({
          tweet: tweet._id,
          replyText,
          promptUsed: prompt
        });
        tweet.llmReply = newReply._id;
        await tweet.save();
        console.log(`Generated reply for tweet ${tweet.tweetId}`);
      }

      const nextRun = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      await jobService.updateJob(job._id, { status: "scheduled", nextRun });
      console.log("LLM job updated to scheduled. Next run at", nextRun.toISOString());
    } catch (error) {
      console.error("Scheduled LLM Reply job error:", error);
      try {
        const job = await jobService.getJobByName(jobName);
        if (job) {
          await jobService.updateJob(job._id, { status: "failed" });
          console.log("LLM job updated to failed status");
        }
      } catch (err) {
        console.error("Error updating LLM job status:", err);
      }
    }
  });
};

function mapTweetData(tweet) {
  return {
    tweetId: tweet.id,
    text: tweet.text,
    authorId: tweet.author_id,
    createdAt: tweet.created_at,
    userName: tweet.username,
    publicMetrics: {
      retweet_count: tweet.public_metrics?.retweet_count,
      reply_count: tweet.public_metrics?.reply_count,
      like_count: tweet.public_metrics?.like_count,
      quote_count: tweet.public_metrics?.quote_count
    }
  };
}