import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import HomeMap from "../components/HomeMap";
import { 
  FaMapMarkerAlt, FaEnvelope, FaBell, FaCheck, 
  FaTimes, FaPlus, FaEdit, FaTrash, FaSave, FaUndo,
  FaCheckCircle
} from "react-icons/fa";

const AdminDashboard = () => {
  // State management
  const [pollutionReports, setPollutionReports] = useState([]);
  const [sensorLocations, setSensorLocations] = useState([]);
  const [alertThreshold, setAlertThreshold] = useState(200);
  const [emailContent, setEmailContent] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [exceededZones, setExceededZones] = useState([]);
  const [editingSensor, setEditingSensor] = useState(null);
  const [individualThresholds, setIndividualThresholds] = useState({});
  const [isLoading, setIsLoading] = useState({
    sensors: false,
    reports: false,
    operations: false
  });
  const [error, setError] = useState(null);

  // AQI configuration
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

  // Helper functions
  const getAqiCategory = (aqi) => {
    for (const [category, range] of Object.entries(aqiCategories)) {
      if (aqi >= range.min && aqi <= range.max) {
        return category;
      }
    }
    return "hazardous";
  };

  // Data fetching
  const fetchPollutionReports = async () => {
    setIsLoading(prev => ({ ...prev, reports: true }));
    setError(null);
    try {
      const response = await axios.get("http://localhost:5002/api/reports");
      setPollutionReports(response.data);
    } catch (error) {
      setError("Failed to load pollution reports");
      console.error("Error fetching pollution reports:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, reports: false }));
    }
  };

  const fetchSensorLocations = async () => {
    setIsLoading(prev => ({ ...prev, sensors: true }));
    setError(null);
    try {
      const response = await axios.get("http://localhost:5002/api/sensor-locations");
      setSensorLocations(response.data);
      
      // Initialize individual thresholds
      const thresholds = {};
      response.data.forEach(sensor => {
        thresholds[sensor._id] = sensor.threshold || alertThreshold;
      });
      setIndividualThresholds(thresholds);
    } catch (error) {
      setError("Failed to load sensor locations");
      console.error("Error fetching sensor locations:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, sensors: false }));
    }
  };

  // Threshold and alert management
  const checkExceededZones = (locations) => {
    const exceeded = locations.filter(location => {
      const threshold = individualThresholds[location._id] !== undefined 
        ? individualThresholds[location._id] 
        : (location.threshold || alertThreshold);
      return location.aqi >= threshold;
    });
    setExceededZones(exceeded);
  };

  const handleThresholdChange = (sensorId, value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 500) return;
    
    setIndividualThresholds(prev => ({
      ...prev,
      [sensorId]: numValue
    }));
  };

  // Sensor CRUD operations
  const handleAddSensorLocation = async () => {
    if (!lat || !lon || !selectedZone || !locationName) {
      setError("Please fill all sensor details");
      toast.error("Please fill all sensor details");
      return;
    }
    
    setIsLoading(prev => ({ ...prev, operations: true }));
    setError(null);
    
    try {
      const newLocation = {
        zone: selectedZone,
        locationName,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        aqi: Math.floor(Math.random() * 500),
        threshold: editingSensor 
          ? individualThresholds[editingSensor._id] || alertThreshold 
          : alertThreshold
      };
      
      if (editingSensor) {
        await axios.put(
          `http://localhost:5002/api/sensor-locations/${editingSensor._id}`,
          newLocation
        );
        toast.success("Sensor updated successfully");
      } else {
        await axios.post(
          "http://localhost:5002/api/sensor-locations",
          newLocation
        );
        toast.success("Sensor added successfully");
      }
      
      await fetchSensorLocations();
      resetSensorForm();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Operation failed";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error processing sensor:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, operations: false }));
    }
  };

  const resetSensorForm = () => {
    setLat("");
    setLon("");
    setLocationName("");
    setSelectedZone("Zone 1");
    setEditingSensor(null);
  };

  const handleEditSensor = (sensor) => {
    setEditingSensor(sensor);
    setLocationName(sensor.locationName);
    setLat(sensor.lat.toString());
    setLon(sensor.lon.toString());
    setSelectedZone(sensor.zone);
    setIndividualThresholds(prev => ({
      ...prev,
      [sensor._id]: sensor.threshold || alertThreshold
    }));
  };

  const handleDeleteSensor = async (sensorId) => {
    if (!window.confirm("Are you sure you want to delete this sensor?")) return;
    
    setIsLoading(prev => ({ ...prev, operations: true }));
    setError(null);
    
    try {
      await axios.delete(`http://localhost:5002/api/sensor-locations/${sensorId}`);
      await fetchSensorLocations();
      toast.success("Sensor deleted successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Delete failed";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error deleting sensor:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, operations: false }));
    }
  };

  // Report operations
  const handleVerifyReport = async (reportId, isVerified) => {
    setIsLoading(prev => ({ ...prev, operations: true }));
    try {
      await axios.put(
        `http://localhost:5002/api/reports/${reportId}`, 
        { isVerified }
      );
      await fetchPollutionReports();
      toast.success(`Report ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      setError("Verification failed");
      toast.error("Failed to verify report");
      console.error("Error verifying report:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, operations: false }));
    }
  };

  const handleResolveReport = async (reportId, resolved) => {
    setIsLoading(prev => ({ ...prev, operations: true }));
    try {
      await axios.put(
        `http://localhost:5002/api/reports/${reportId}`, 
        { resolved }
      );
      await fetchPollutionReports();
      toast.success(`Report ${resolved ? 'resolved' : 'reopened'} successfully`);
    } catch (error) {
      setError("Operation failed");
      toast.error("Failed to update report status");
      console.error("Error resolving report:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, operations: false }));
    }
  };

  // Email operations
  const handleSendEmail = async () => {
    if (!emailAddress) {
      setError("Please enter an email address");
      toast.error("Please enter an email address");
      return;
    }
    
    setIsLoading(prev => ({ ...prev, operations: true }));
    try {
      await axios.post("http://localhost:5002/api/send-email", {
        email: emailAddress,
        content: emailContent,
      });
      setEmailContent("");
      setEmailAddress("");
      toast.success("Email sent successfully");
    } catch (error) {
      setError("Failed to send email");
      toast.error("Failed to send email");
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, operations: false }));
    }
  };

  // Effects
  useEffect(() => {
    fetchPollutionReports();
    fetchSensorLocations();
  }, []);

  useEffect(() => {
    checkExceededZones(sensorLocations);
  }, [alertThreshold, sensorLocations, individualThresholds]);

  // Prepare map markers
const formattedMarkers = sensorLocations.map(location => ({
  geocode: [location.lat, location.lon],
  label: location.zone,
  locationName: location.locationName,
  aqi: location.aqi,
  status: getAqiCategory(location.aqi),
  coverageRadius: 150 // This matches the SENSOR_COVERAGE_RADIUS in HomeMap
}));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-100 py-2 border-b border-gray-300">
        <div className="w-full px-2 py-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h5 className="font-bold text-lg text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Admin Dashboard
            </h5>
            {error && (
              <div className="text-red-600 bg-red-100 px-3 py-1 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-6 pb-10">
        {/* Map and Pollution Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section - Fixed height and overflow */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Sensor Locations</h2>
            </div>
            <div className="relative" style={{ height: "400px" }}>
              <HomeMap 
                markers={formattedMarkers} 
                style={{ width: "100%", height: "100%" }}
              />
              <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md z-10">
                <div className="flex flex-col space-y-1">
                  {Object.entries(categoryColors).map(([key, color]) => (
                    <div key={key} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-xs">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Pollution Reports Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Pollution Reports</h2>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
              {isLoading.reports ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : pollutionReports.length > 0 ? (
                pollutionReports.map((report) => (
                  <div key={report._id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-700">{report.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Reported by: {report.user} | {report.date}
                        </p>
                        <p className="text-sm text-gray-500">
                          Location: {report.location} | Type: {report.pollutionType}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="flex items-center bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                        onClick={() => handleVerifyReport(report._id, true)}
                        disabled={report.isVerified || isLoading.operations}
                      >
                        <FaCheck className="mr-1" /> Verify
                      </button>
                      <button
                        className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                        onClick={() => handleVerifyReport(report._id, false)}
                        disabled={!report.isVerified || isLoading.operations}
                      >
                        <FaTimes className="mr-1" /> Unverify
                      </button>
                      <button
                        className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                        onClick={() => handleResolveReport(report._id, !report.resolved)}
                        disabled={isLoading.operations}
                      >
                        {report.resolved ? (
                          <>
                            <FaUndo className="mr-1" /> Reopen
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="mr-1" /> Resolve
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No pollution reports available</p>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Sensor Placement Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sensor Management</h2>
          
          {/* Threshold Setting */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Default Alert Threshold (for new sensors)</h3>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                min="0"
                max="500"
              />
              <span className="text-sm text-gray-600">(0-500 AQI scale)</span>
            </div>
          </div>
          
          {/* Sensor Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              placeholder="Location Name"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              disabled={isLoading.operations}
            />
            <input
              type="number"
              placeholder="Latitude"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              step="any"
              disabled={isLoading.operations}
            />
            <input
              type="number"
              placeholder="Longitude"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              step="any"
              disabled={isLoading.operations}
            />
            <select
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              disabled={isLoading.operations}
            >
              {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"].map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className={`flex items-center justify-center flex-1 ${
                  editingSensor ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50`}
                onClick={handleAddSensorLocation}
                disabled={isLoading.operations}
              >
                {isLoading.operations ? (
                  <span className="animate-spin">Processing...</span>
                ) : editingSensor ? (
                  <>
                    <FaSave className="mr-2" /> Update
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add
                  </>
                )}
              </button>
              {editingSensor && (
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  onClick={resetSensorForm}
                  disabled={isLoading.operations}
                >
                  <FaUndo />
                </button>
              )}
            </div>
          </div>
          
          {/* Sensors Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            {isLoading.sensors ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sensorLocations.length > 0 ? (
                    sensorLocations.map((sensor) => {
                      const aqiCategory = getAqiCategory(sensor.aqi);
                      const currentThreshold = individualThresholds[sensor._id] !== undefined 
                        ? individualThresholds[sensor._id] 
                        : (sensor.threshold || alertThreshold);
                      const isExceeded = sensor.aqi >= currentThreshold;
                      
                      return (
                        <tr key={sensor._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {sensor.locationName || "Unnamed"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{sensor.zone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {sensor.lat.toFixed(4)}, {sensor.lon.toFixed(4)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                              style={{ 
                                backgroundColor: categoryColors[aqiCategory],
                                color: aqiCategory === 'moderate' ? '#000' : '#fff'
                              }}
                            >
                              {sensor.aqi}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              className="w-20 p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={currentThreshold}
                              onChange={(e) => handleThresholdChange(sensor._id, e.target.value)}
                              min="0"
                              max="500"
                              disabled={isLoading.operations}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isExceeded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {isExceeded ? 'Exceeded' : 'Normal'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditSensor(sensor)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50"
                              disabled={isLoading.operations}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteSensor(sensor._id)}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              disabled={isLoading.operations}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No sensors found. Add your first sensor above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
  
        {/* Email Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Send Email to Users</h2>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
            disabled={isLoading.operations}
          />
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] disabled:opacity-50"
            placeholder="Enter email content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            disabled={isLoading.operations}
          />
          <button
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleSendEmail}
            disabled={isLoading.operations}
          >
            {isLoading.operations ? (
              <span className="animate-spin">Sending...</span>
            ) : (
              <>
                <FaEnvelope className="mr-2" /> Send Email
              </>
            )}
          </button>
        </div>
  
        {/* Alert Box */}
        {exceededZones.length > 0 && (
          <div className="mt-6 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start">
            <FaBell className="text-2xl mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Alert!</h3>
              <p className="mb-2">The following zones have exceeded their alert thresholds:</p>
              <ul className="list-disc list-inside space-y-1">
                {exceededZones.map((zone) => (
                  <li key={zone._id}>
                    <span className="font-medium">{zone.locationName || zone.zone}</span> 
                    (AQI: {zone.aqi}, Threshold: {individualThresholds[zone._id] !== undefined 
                      ? individualThresholds[zone._id] 
                      : (zone.threshold || alertThreshold)})
                  </li>
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