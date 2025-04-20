const express = require("express");
const router = express.Router();
const {
  createPollutionReport,
  getAllPollutionReports,
  updatePollutionReport,
  deletePollutionReport,
} = require("../controllers/reportsController");

// Create a new pollution report
router.post("/", createPollutionReport);

// Get all pollution reports
router.get("/", getAllPollutionReports);

// Update a pollution report (verification/resolution)
router.put("/:id", updatePollutionReport);

// Delete a pollution report
router.delete("/:id", deletePollutionReport);

module.exports = router;