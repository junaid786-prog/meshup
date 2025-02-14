const cron = require("node-cron");
const tweetService = require("./services/tweet.service");
const jobService = require("./services/job.service");
const configService = require("./services/config.service");
const tweetModel = require("./models/tweet");
const userService = require("./services/user.service"); // Ensure we fetch users
const config = require("./config/config");

// 🚀 **Tweet Search Job** (User-Specific)
exports.scheduleTweetSearchJob = () => {
  const scheduleExpression = "0 */6 * * *";
  console.log(`🔄 Setting up **User-Specific Tweet Search Cron Job**: "${scheduleExpression}"`);

  cron.schedule(scheduleExpression, async () => {
    console.log("🚀 **Tweet Search Job Triggered** at", new Date().toISOString());
    
    try {
      // Fetch all users
      const users = await userService.getAllUsers();
      
      for (const user of users) {
        const userId = user._id;
        const jobName = `tweetSearch_${userId}`;

        let job = await jobService.getJobByName(jobName, userId);
        const now = new Date();

        if (!job) {
          job = await jobService.createJob({
            jobName,
            user: userId,
            status: "running",
            lastRun: now,
            nextRun: new Date(now.getTime() + 6 * 60 * 60 * 1000),
          });
          console.log(`✅ Created new **Tweet Search Job** for user: ${userId}`);
        } else {
          job = await jobService.updateJob(job._id, { status: "running", lastRun: now });
          console.log(`🔄 Updated job status to **running** for user: ${userId}`);
        }

        // Fetch user's search keywords
        const userConfig = await configService.getConfig(userId);
        const keywords = userConfig.defaultKeywords || "marketing";

        console.log(`🔍 Fetching tweets for **User ${userId}** with keywords: "${keywords}"`);

        const tweetsData = await tweetService.fetchTweetsFromTwitter(keywords, job.metaData?.data?.next_token);

        if (!tweetsData.data) {
          console.log(`⚠️ No tweets found for **User ${userId}**`);
          continue;
        }

        // Save tweets with user association
        const tweets = tweetsData.data.map(tweet => ({
          ...mapTweetData(tweet),
          user: userId,
        }));

        await tweetModel.insertMany(tweets);
        console.log(`✅ **Saved ${tweets.length} Tweets** for User ${userId}`);

        const nextRun = new Date(now.getTime() + 6 * 60 * 60 * 1000);
        await jobService.updateJob(job._id, {
          status: "scheduled",
          nextRun,
          metaData: { data: { next_token: tweetsData.meta?.next_token } },
        });

        console.log(`⏳ Job updated for **User ${userId}** - Next run at: ${nextRun.toISOString()}`);
      }
    } catch (error) {
      console.error("❌ **Tweet Search Job Error:**", error);
    }
  });
};

// 🚀 **LLM Reply Generation Job** (User-Specific)
exports.schedulellmReplyJob = () => {
  const scheduleExpression = config.nodeEnv === "development" ? "* * * * *" : "0 * * * *";
  console.log(`🔄 Setting up **User-Specific LLM Reply Cron Job**: "${scheduleExpression}"`);

  cron.schedule(scheduleExpression, async () => {
    console.log("🚀 **LLM Reply Generation Job Triggered** at", new Date().toISOString());
    
    try {
      const users = await userService.getAllUsers();
      
      for (const user of users) {
        const userId = user._id;
        const jobName = `llmReplyGeneration_${userId}`;

        let job = await jobService.getJobByName(jobName, userId);
        const now = new Date();

        if (!job) {
          job = await jobService.createJob({
            jobName,
            user: userId,
            status: "running",
            lastRun: now,
            nextRun: new Date(now.getTime() + 1 * 60 * 60 * 1000),
          });
          console.log(`✅ Created new **LLM Reply Job** for user: ${userId}`);
        } else {
          job = await jobService.updateJob(job._id, { status: "running", lastRun: now });
          console.log(`🔄 Updated job status to **running** for user: ${userId}`);
        }

        // Find tweets without an LLM reply for this user
        const tweets = await tweetModel.find({ user: userId, llmReply: { $exists: false } });

        if (tweets.length === 0) {
          console.log(`⚠️ No tweets to reply for **User ${userId}**`);
          continue;
        }

        console.log(`📝 Found **${tweets.length} Tweets** for LLM Reply for User ${userId}`);

        const replyService = require("./services/reply.service");
        for (const tweet of tweets) {
          const userConfig = await configService.getConfig(userId);
          const prompt = userConfig.defaultPrompt || "Generate a friendly marketing reply.";

          const replyText = await replyService.generateReplyForTweet(tweet.text, prompt);
          const Reply = require("./models/reply");

          const newReply = await Reply.create({
            tweet: tweet._id,
            replyText,
            promptUsed: prompt,
            user: userId,
          });

          tweet.llmReply = newReply._id;
          await tweet.save();
          console.log(`✅ **Generated LLM Reply for Tweet ${tweet.tweetId}** (User: ${userId})`);
        }

        const nextRun = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        await jobService.updateJob(job._id, { status: "scheduled", nextRun });

        console.log(`⏳ Job updated for **User ${userId}** - Next run at: ${nextRun.toISOString()}`);
      }
    } catch (error) {
      console.error("❌ **LLM Reply Job Error:**", error);
    }
  });
};

// ✅ **Helper Function: Format Tweet Data**
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
      quote_count: tweet.public_metrics?.quote_count,
    },
  };
}
