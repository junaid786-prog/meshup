const cron = require("node-cron");
const tweetService = require("./services/tweet.service");
const jobService = require("./services/job.service");
const configService = require("./services/config.service");
const config = require("./config/config");

exports.scheduleTweetSearchJob = () => {
  // Use a schedule of every minute in development, every 6 hours in production.
  const scheduleExpression = config.nodeEnv === "development" ? "* * * * *" : "0 */6 * * *";
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

      const tweetsData = await tweetService.fetchTweetsFromTwitter(keywords);
      console.log("Fetched tweets:", tweetsData);

      // Schedule the next run (update job record)
      const nextRun = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      await jobService.updateJob(job._id, { status: "scheduled", nextRun });
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
