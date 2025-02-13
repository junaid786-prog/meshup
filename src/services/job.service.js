const Job = require("../models/job");

exports.getJobStatus = async () => {
  return await Job.find({});
};

exports.createJob = async (jobData) => {
  return await Job.create(jobData);
};

exports.updateJob = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
};

exports.deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};
