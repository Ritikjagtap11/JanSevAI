const express = require('express');
const router = express.Router();
const { saveCitizen } = require('../controllers/citizenController');
const { analyzeEligibility } = require('../controllers/aiController');

router.post('/', saveCitizen);
router.post('/analyze', analyzeEligibility);

module.exports = router;
