const jobDao = require('../dao/jobDao');
const ApiError = require('../utils/apiError');

class JobService {
  async getJobs() {
    return jobDao.getAllJobs();
  }

  async getJobById(id) {
    const job = await jobDao.getJobById(id);
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }
    return job;
  }
}

module.exports = new JobService();
