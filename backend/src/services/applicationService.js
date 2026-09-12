const applicationDao = require('../dao/applicationDao');
const jobDao = require('../dao/jobDao');
const validationService = require('./validationService');
const ApiError = require('../utils/apiError');

class ApplicationService {
  async applyToJob(jobId, answersData) {
    const job = await jobDao.getJobById(jobId);
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    // Check if already applied
    const existing = await applicationDao.getApplicationByJobId(jobId);
    if (existing) {
      throw new ApiError(400, 'You have applied to this job');
    }

    const validAnswers = validationService.validateAnswers(job.questions, answersData);
    
    return applicationDao.createApplication(jobId, validAnswers);
  }

  async bulkApply(applicationsData) {
    if (!Array.isArray(applicationsData)) {
      throw new ApiError(400, 'applicationsData must be an array');
    }

    const results = [];
    const errors = [];

    for (const app of applicationsData) {
      try {
        const result = await this.applyToJob(app.jobId, app.data);
        results.push(result);
      } catch (err) {
        errors.push({ jobId: app.jobId, error: err.message });
      }
    }

    return { results, errors };
  }

  async getApplications() {
    return applicationDao.getAllApplications();
  }
}

module.exports = new ApplicationService();
