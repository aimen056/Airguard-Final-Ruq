import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeMap from "../components/HomeMap";
import { FaMapMarkerAlt, FaEnvelope, FaBell, FaCheck, FaTimes, FaPlus } from "react-icons/fa"; // Icons for better UI

const AdminDashboard = () => {
  const [pollutionReports, setPollutionReports] = useState([]);
  const [sensorLocations, setSensorLocations] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(200);
  const [emailContent, setEmailContent] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [exceededZones, setExceededZones] = useState([]);

  const categoryColors = {
    good: "#70E000",
    moderate: "#FEDD00",
    unhealthySensitive: "#FE7434",
    unhealthy: "#F41C34",
    veryUnhealthy: "#B4418E",
    hazardous: "#7B0D1E",
  };

  const aqiCategories = {
    good: { min: 0, max: 50 },
    moderate: { min: 51, max: 100 },
    unhealthySensitive: { min: 101, max: 150 },
    unhealthy: { min: 151, max: 200 },
    veryUnhealthy: { min: 201, max: 300 },
    hazardous: { min: 301, max: 500 },
  };

  const getAqiCategory = (aqi) => {
    for (const [category, range] of Object.entries(aqiCategories)) {
      if (aqi >= range.min && aqi <= range.max) {
        return category;
      }
    }
    return "hazardous";
  };

  useEffect(() => {
    fetchPollutionReports();
    fetchSensorLocations();
  }, []);

  useEffect(() => {
    checkExceededZones(sensorLocations);
  }, [alertThreshold, sensorLocations]);

  const fetchPollutionReports = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/pollution-reports");
      setPollutionReports(response.data);
    } catch (error) {
      console.error("Error fetching pollution reports:", error);
    }
  };

  const fetchSensorLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/sensor-locations");
      setSensorLocations(response.data);
    } catch (error) {
      console.error("Error fetching sensor locations:", error);
    }
  };

  const checkExceededZones = (sensorLocations) => {
    const exceeded = sensorLocations.filter(
      (location) => location.aqi >= alertThreshold
    );
    setExceededZones(exceeded);
  };

  const handleVerifyReport = async (reportId, isVerified) => {
    try {
      await axios.put(`http://localhost:5002/api/pollution-reports/${reportId}`, { isVerified });
      fetchPollutionReports();
    } catch (error) {
      console.error("Error verifying report:", error);
    }
  };

  const handleAddSensorLocation = async () => {
    try {
      const newLocation = {
        zone: selectedZone,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        aqi: Math.floor(Math.random() * 500), // Simulate AQI for demonstration
      };
      await axios.post("http://localhost:5002/api/sensor-locations", newLocation);
      fetchSensorLocations();
      setLat("");
      setLon("");
    } catch (error) {
      console.error("Error adding sensor location:", error);
    }
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      alert("Please enter an email address.");
      return;
    }
    try {
      await axios.post("http://localhost:5002/api/send-email", {
        email: emailAddress,
        content: emailContent,
      });
      alert("Email sent successfully!");
      setEmailContent("");
      setEmailAddress("");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleSetAlertThreshold = async () => {
    try {
      await axios.put("http://localhost:5002/api/alert-threshold", { threshold: alertThreshold });
      alert("Alert threshold updated successfully!");
      fetchSensorLocations();
    } catch (error) {
      console.error("Error setting alert threshold:", error);
    }
  };

  const formattedMarkers = sensorLocations.map(location => ({
    geocode: [location.lat, location.lon],
    label: location.zone
  }));

  return (
    <div>
      {/* Header */}
      <header className="bg-gray-100 py-2 border-b border-gray-300">
        <div className="w-full px-2 py-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h5 className="font-bold text-lg text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Admin Dashboard
            </h5>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <div className="max-w-5x2 mx-auto px-4 mt-6">
        {/* Map and Pollution Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="relative w-full h-[357px] flex flex-row rounded-lg shadow-lg border border-gray-300 bg-white">
            <HomeMap markers={formattedMarkers} className="flex-grow rounded-l-lg h-full" />
  
            {/* Vertical Color Category Section */}
            <div className="flex flex-col justify-between p-2 bg-gray-100 rounded-r-lg w-[140px] h-full space-y-2">
              {Object.entries(categoryColors).map(([key, color]) => (
                <span
                  key={key}
                  className="flex-1 flex items-center justify-center text-white text-sm rounded-md font-medium transition-transform transform hover:scale-105 shadow-md px-2 py-2"
                  style={{ backgroundColor: color }}
                >
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
  
          {/* Pollution Reports Section */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Pollution Reports</h2>
            </div>
            <div className="p-4">
              {pollutionReports.map((report, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-gray-700">{report.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Reported by: {report.user}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                      onClick={() => handleVerifyReport(report.id, true)}
                    >
                      <FaCheck className="mr-1" /> Verify
                    </button>
                    <button
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => handleVerifyReport(report.id, false)}
                    >
                      <FaTimes className="mr-1" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Sensor Placement Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sensor Placement</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Latitude"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              type="text"
              placeholder="Longitude"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
            <input
              type="text"
              placeholder="Zone"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            />
            <button
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleAddSensorLocation}
            >
              <FaPlus className="mr-2" /> Add Sensor
            </button>
          </div>
        </div>
  
        {/* Email Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Send Email to Users</h2>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <button
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600 transition-colors"
            onClick={handleSendEmail}
          >
            <FaEnvelope className="mr-2" /> Send Email
          </button>
        </div>
  
        {/* Alert Threshold Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Set Alert Threshold</h2>
          <div className="flex gap-4">
            <input
              type="number"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
            />
            <button
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleSetAlertThreshold}
            >
              <FaBell className="mr-2" /> Set Threshold
            </button>
          </div>
        </div>
  
        {/* Alert Box */}
        {exceededZones.length > 0 && (
          <div className="mt-6 mb-6 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center">
            <FaBell className="text-2xl mr-3" />
            <div>
              <h3 className="font-bold">Alert!</h3>
              <p>The following zones have exceeded the alert threshold of {alertThreshold}:</p>
              <ul className="list-disc list-inside">
                {exceededZones.map((zone, index) => (
                  <li key={index}>{zone.zone}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default AdminDashboard;