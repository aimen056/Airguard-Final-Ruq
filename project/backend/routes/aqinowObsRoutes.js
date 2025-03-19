const express = require("express");
const router = express.Router();
const { getObservationsByMonitoringSite } = require("../controllers/airnowObservations");

router.get("/observations", getObservationsByMonitoringSite);

module.exports = router;