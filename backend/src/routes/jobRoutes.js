const express = require('express');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.post('/:id/apply', jobController.applyToJob);

module.exports = router;
