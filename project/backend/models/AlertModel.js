const { Schema, model } = require("mongoose");

const AlertSchema = new Schema({
  alertName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  location: {
    type: String,
    required: true,
  },
  pollutantName: {
    type: String,
    required: true,
  },
  thresholdType: {
    type: String,
    enum: ["AQI", "Duration"],
    required: true,
  },

  aqiCondition: {
    type: String,
    enum: ["greater", "less"],
    required: function () {
      return this.thresholdType === "AQI";
    },
  },
  aqiValue: {
    type: Number,
    required: function () {
      return this.thresholdType === "AQI";
    },
    min: [0, "AQI must be at least 0"],
    max: [500, "AQI must not exceed 500"],
  },

  durationAqiValue: {
    type: Number,
    required: function () {
      return this.thresholdType === "Duration";
    },
    min: [0, "AQI must be at least 0"],
    max: [500, "AQI must not exceed 500"],
  },
  durationCondition: {
    type: String,
    enum: ["greater", "less"],
    required: function () {
      return this.thresholdType === "Duration";
    },
  },
  durationHours: {
    type: Number,
    required: function () {
      return this.thresholdType === "Duration";
    },
    min: [1, "Duration must be at least 1 hour"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Alert", AlertSchema);


