const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/airguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const aqiRoutes = require("./routes/aqiRoutes");
const pollutionReports = require('./routes/pollutionReports');
const sensorLocations = require('./routes/sensorLocations');
const sendEmail = require('./routes/sendEmail');
const alertThreshold = require('./routes/alertThreshold');
const alertRoutes = require("./routes/alertRoutes");
const reportRoutes = require('./routes/reportRoutes');
const aqinowRoutes = require('./routes/aqinowRoutes');
const airnowObservations = require("./routes/aqinowObsRoutes");

// Route Definitions
app.use('/auth', authRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/pollution-reports', pollutionReports);
app.use('/api/sensor-locations', sensorLocations);
app.use('/api/send-email', sendEmail);
app.use('/api/alert-threshold', alertThreshold);

app.use('/api/airnow', aqinowRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/airObs', airnowObservations);
app.use('/api/reports', reportRoutes);

app.use('/api', (req, res) => {
    res.send("Hello from AirGuard API");
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('AIRNOW_API_KEY:', process.env.AIRNOW_API_KEY);
console.log('EMAIL_VERIFICATION_API_KEY:', process.env.EMAIL_VERIFICATION_API_KEY);