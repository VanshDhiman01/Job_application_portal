const express = require('express');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router.get('/', applicationController.getApplications);
router.post('/bulk', applicationController.bulkApply);

module.exports = router;
