const express = require('express');
const router = express.Router();
const {getAirNowCurrentData }  = require('../controllers/airnowController');


router.get('/current', getAirNowCurrentData )

module.exports = router;