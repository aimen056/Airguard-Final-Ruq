const express = require('express');
const aqiController = require('../controllers/aqiController');

const router = express.Router();

router.get('/', aqiController.getAQIData);


module.exports = router;