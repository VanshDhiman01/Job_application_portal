const applicationService = require('../services/applicationService');

class ApplicationController {
  async bulkApply(req, res, next) {
    try {
      const result = await applicationService.bulkApply(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getApplications(req, res, next) {
    try {
      const applications = await applicationService.getApplications();
      res.json(applications);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ApplicationController();
