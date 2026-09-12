const jobService = require('../services/jobService');
const applicationService = require('../services/applicationService');

class JobController {
  async getJobs(req, res, next) {
    try {
      const jobs = await jobService.getJobs();
      res.json(jobs);
    } catch (err) {
      next(err);
    }
  }

  async getJobById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);
      res.json(job);
    } catch (err) {
      next(err);
    }
  }

  async applyToJob(req, res, next) {
    try {
      const { id } = req.params;
      const application = await applicationService.applyToJob(id, req.body);
      res.status(201).json(application);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new JobController();
