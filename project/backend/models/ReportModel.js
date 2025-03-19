const { Schema, model } = require("mongoose");

const PollutionReportSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
   
    },
    location: {
      type: String,
      required: true,
   
    },
    pollutionType: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Storing as a string to match frontend format
      required: true,
    },
  },
  { timestamps: true }
);


// Replace export
module.exports = model("PollutionReport", PollutionReportSchema);