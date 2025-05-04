// // routes/aqiSensor.js
// const express = require('express');
// const router = express.Router();
// const { calculateIndex } = require('../utils/calculateaqi'); // Import the utility

// router.post('/', (req, res) => {
//   const { pm25, pm10, o3, co } = req.body; // Destructure the pollutants from the request

//   // Initialize an object to store AQI values for each pollutant
//   const aqiData = {};

//   // Calculate AQI for each pollutant using the calculateIndex function
//   if (pm25 !== undefined) {
//     aqiData.pm25 = calculateIndex(pm25, 'pm25');
//   }
//   if (pm10 !== undefined) {
//     aqiData.pm10 = calculateIndex(pm10, 'pm10');
//   }
//   if (o3 !== undefined) {
//     aqiData.o3 = calculateIndex(o3, 'o3');
//   }
//   if (co !== undefined) {
//     aqiData.co = calculateIndex(co, 'co');
//   }

//   // Respond with calculated AQI values
//   res.status(200).json({
//     message: 'Sensor data received and AQI calculated successfully',
//     aqiData
//   });
// });

// module.exports = router;
