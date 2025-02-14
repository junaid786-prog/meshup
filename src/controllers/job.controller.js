const jobService = require("../services/job.service");
const { sendResponse } = require("../utils/responseHandler");

exports.getJobs = async (req, res, next) => {
  const user = req.user;
  try {
    const jobs = await jobService.getJobStatus({ user: user.id });
    sendResponse(res, 200, { jobs });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  const user = req.user;
  try {
    const newJob = await jobService.createJob({ ...req.body, user: user.id });
    sendResponse(res, 201, { job: newJob });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const updatedJob = await jobService.updateJob(req.params.id, req.body);
    sendResponse(res, 200, { job: updatedJob });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);
    sendResponse(res, 200, { message: "Job deleted" });
  } catch (error) {
    next(error);
  }
};
