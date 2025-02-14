const Job = require("../models/job");

exports.getJobStatus = async (query) => {
  return await Job.find(query);
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

exports.getJobByName = async (jobName) => {
  return await Job.findOne({ jobName });
}

