const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

router.get("/", jobController.getJobs);
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
