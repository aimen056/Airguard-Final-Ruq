import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import HomeMap from "../components/HomeMap";
import AqiCard from "../components/Home/AqiCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../redux/features/repPollutionSlice";
import { NavLink } from "react-router-dom";
import Heatmap from "../components/Home/Heatmap";
import DropletIcon from "../assets/icons/droplet.svg";
import SpeedometerIcon from "../assets/icons/speedometer.svg";
import ThermometerIcon from "../assets/icons/thermometer.svg";

const UserDashboard = () => {
  const [aqiData, setAqiData] = useState(null);
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [selectedDate, setSelectedDate] = useState("today");
  const [highestAQI, setHighestAQI] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [formattedMarkers, setFormattedMarkers] = useState([]);
  const [sensorLocations, setSensorLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);

  const gaugeChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const gaugeChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  const ALERT_THRESHOLD = 200;

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

  // Helper component for pollutant display
  const PollutantBox = ({ name, data }) => (
    <div className="flex flex-col items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 w-28 h-28 m-2">
      <h6 className="font-bold text-blue-600 dark:text-blue-400">{name}</h6>
      <p className="text-lg font-semibold">{data?.aqi || 'N/A'}</p>
      <small className="text-gray-500 dark:text-gray-400">µg/m³</small>
    </div>
  );

  // Generate random trend data
  const generateRandomTrendData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });
    
    return hours.map(time => ({
      timestamp: new Date(`2023-01-01T${time}:00`).toISOString(),
      aqi: Math.floor(Math.random() * 150) + 50 // Random AQI between 50-200
    }));
  };

  // Generate random heatmap data
  const generateRandomHeatmapData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const times = ["Morning", "Afternoon", "Evening"];
    
    return days.flatMap(day => 
      times.map(time => ({
        x: day,
        y: time,
        value: Math.floor(Math.random() * 100) + 30 // Random value between 30-130
      }))
    );
  };

  const getAqiCategory = (aqi) => {
    for (const [category, range] of Object.entries(aqiCategories)) {
      if (aqi >= range.min && aqi <= range.max) {
        return category;
      }
    }
    return "hazardous";
  };

  const locationToZoneMapping = {
    "Zone 1": { lat: [24.8, 25.0], lon: [67.0, 67.2] },
    "Zone 2": { lat: [33.6, 33.8], lon: [73.0, 73.2] },
    "Zone 3": { lat: [31.5, 31.7], lon: [74.3, 74.5] },
    "Zone 4": { lat: [34.0, 34.2], lon: [71.5, 71.7] },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const zone = Object.keys(locationToZoneMapping).find(
      (zone) => zone.toLowerCase() === query
    );
    if (zone) {
      setSelectedZone(zone);
    } else {
      alert("Zone not found. Please enter a valid zone (Zone 1, Zone 2, etc.).");
    }
  };

  useEffect(() => {
    // Initialize heatmap data
    setHeatmapData(generateRandomHeatmapData());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          determineZone(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setSelectedZone("Zone 1");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setSelectedZone("Zone 1");
    }
  }, []);

  const determineZone = (latitude, longitude) => {
    for (const [zone, range] of Object.entries(locationToZoneMapping)) {
      if (
        latitude >= range.lat[0] &&
        latitude <= range.lat[1] &&
        longitude >= range.lon[0] &&
        longitude <= range.lon[1]
      ) {
        setSelectedZone(zone);
        return;
      }
    }
    setSelectedZone("Zone 1");
  };

  useEffect(() => {
    const fetchSensorLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/sensor-locations");
        setSensorLocations(response.data);
        
        const formatted = response.data.map(sensor => ({
          geocode: [sensor.lat, sensor.lon],
          label: sensor.zone,
          locationName: sensor.locationName,
          aqi: sensor.aqi,
          status: getAqiCategory(sensor.aqi)
        }));
        setFormattedMarkers(formatted);
      } catch (error) {
        console.error("Error fetching sensor locations:", error);
        // Fallback dummy sensor data
        const dummySensors = [
          { lat: 24.9, lon: 67.1, zone: "Zone 1", locationName: "Downtown", aqi: 75 },
          { lat: 33.7, lon: 73.1, zone: "Zone 2", locationName: "Industrial Area", aqi: 120 },
          { lat: 31.6, lon: 74.4, zone: "Zone 3", locationName: "Residential Area", aqi: 65 },
          { lat: 34.1, lon: 71.6, zone: "Zone 4", locationName: "Suburb", aqi: 90 }
        ];
        setSensorLocations(dummySensors);
        setFormattedMarkers(dummySensors.map(sensor => ({
          geocode: [sensor.lat, sensor.lon],
          label: sensor.zone,
          locationName: sensor.locationName,
          aqi: sensor.aqi,
          status: getAqiCategory(sensor.aqi)
        })));
      }
    };

    fetchSensorLocations();
  }, []);

  useEffect(() => {
    if (!selectedZone) return;

    const fetchAqiData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/aqi?zone=${selectedZone}&date=${selectedDate}`
        );
        // Ensure trendData exists in response, otherwise use dummy data
        const dataWithTrend = {
          ...response.data,
          trendData: response.data.trendData || generateRandomTrendData()
        };
        setAqiData(dataWithTrend);

        // Calculate highest AQI from pollutants
        if (response.data.pollutants) {
          const pollutantValues = Object.values(response.data.pollutants).map(p => p.aqi);
          const maxAQI = Math.max(...pollutantValues);
          setHighestAQI(maxAQI);
        } else if (response.data.overallAQI) {
          setHighestAQI(response.data.overallAQI);
        } else {
          // If no AQI data, use max from trend data
          const maxTrendAQI = Math.max(...dataWithTrend.trendData.map(d => d.aqi));
          setHighestAQI(maxTrendAQI);
        }
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        // Create fallback data structure with dummy trend
        const fallbackData = {
          overallAQI: Math.floor(Math.random() * 150) + 50,
          trendData: generateRandomTrendData(),
          pollutants: {
            pm2_5: { aqi: Math.floor(Math.random() * 100) + 30 },
            pm10: { aqi: Math.floor(Math.random() * 100) + 30 },
            o3: { aqi: Math.floor(Math.random() * 80) + 20 },
            no2: { aqi: Math.floor(Math.random() * 70) + 20 },
            so2: { aqi: Math.floor(Math.random() * 60) + 15 },
            co: { aqi: Math.floor(Math.random() * 50) + 10 }
          }
        };
        setAqiData(fallbackData);
        setHighestAQI(fallbackData.overallAQI);
      }
    };

    fetchAqiData();
    const interval = setInterval(fetchAqiData, 60000);
    return () => clearInterval(interval);
  }, [selectedZone, selectedDate]);

  useEffect(() => {
    if (!aqiData) return;
    if (gaugeChartInstance.current) gaugeChartInstance.current.destroy();
    if (trendChartInstance.current !== null) {
      trendChartInstance.current.destroy();
    }

    if (gaugeChartRef.current) {
      gaugeChartInstance.current = new Chart(gaugeChartRef.current, {
        type: "doughnut",
        data: {
          labels: Object.keys(categoryColors),
          datasets: [
            {
              data: [50, 50, 50, 50, 50, 50],
              backgroundColor: Object.values(categoryColors),
              borderWidth: 0,
            },
          ],
        },
        options: {
          rotation: 270,
          circumference: 180,
          cutout: "80%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        },
      });
    }

    if (trendChartRef.current) {
      const trendData = aqiData?.trendData || generateRandomTrendData();
      
      trendChartInstance.current = new Chart(trendChartRef.current, {
        type: "line",
        data: {
          labels: trendData.map((data) => 
            new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit' })
          ),
          datasets: [
            {
              label: "AQI Trend",
              data: trendData.map((data) => data.aqi),
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `AQI: ${context.raw}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              max: 300,
              ticks: {
                stepSize: 50
              }
            }
          }
        },
      });
    }
  }, [aqiData]);

  const dispatch = useDispatch();
  const { pollutions, status } = useSelector((state) => state.pollution);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="pt-16 bg-background dark:bg-background dark:text-[#E4E4E7]">
      {/* Search Header */}
      <header className="bg-gray-100 dark:bg-gray-800 py-2 border-b border-gray-300 dark:border-gray-700">
        <div className="w-full px-4 py-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h5 className="font-bold text-lg text-gray-800 dark:text-gray-200 flex items-center">
              🌤️ AIR QUALITY DASHBOARD
            </h5>
            <form onSubmit={handleSearch} className="mt-2 lg:mt-0">
              <input
                type="text"
                className="p-2 border border-gray-400 dark:border-gray-600 rounded w-full lg:w-[500px] bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Search your zone (Zone 1, Zone 2, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      <div className="p-5 text-primaryText dark:text-secondaryText">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map and Gauge Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 bg-[url('./assets/Lightbg.png')] dark:bg-[url('./assets/Darkbg.png')] bg-no-repeat bg-cover bg-center rounded-3xl md:col-span-2 p-4 gap-4 shadow-2xl">
            <div className="bg-surfaceColor/60 rounded-2xl p-4">
              <HomeMap markers={formattedMarkers} fullscreen={false} />
            </div>
            <div className="bg-surfaceColor/60 rounded-2xl p-4">
              <div className="bg-surfaceColor p-3 rounded-2xl">
                <div className="relative h-42 mt-3">
                  <canvas ref={gaugeChartRef}></canvas>
                  {aqiData && (
                    <div
                      className="absolute top-14 left-1/2 transform -translate-x-1/2"
                      style={{
                        width: "2px",
                        height: "39%",
                        backgroundColor: "black",
                        transform: `rotate(${(highestAQI / 320) * 180 - 90}deg)`,
                        transformOrigin: "bottom center",
                        bottom: "0",
                      }}
                    ></div>
                  )}
                </div>
              </div>
              <div className="bg-surfaceColor p-3 rounded-2xl">
                <AqiCard 
                  aqiData={aqiData} 
                  highestAQI={highestAQI} 
                  categoryColors={categoryColors} 
                  getAqiCategory={getAqiCategory} 
                  selectedZone={selectedZone} 
                />
              </div>
            </div>
          </div>
          
          {/* Welcome Card */}
          <div className="bg-surfaceColor rounded-3xl shadow-2xl p-4 gap-4">
            <div className="rounded-2xl bg-gradient-to-bl from-red-300 via-orange-300 to-amber-300 dark:bg-gradient-to-bl dark:from-emerald-500 dark:from-10% dark:via-teal-700 dark:to-50% dark:to-cyan-900 h-full">
              <div>
                <h2 className="text-2xl font-semibold p-6 text-center text-white">
                  Welcome {user?.name || "User"}
                </h2>
                <div className={`p-4 rounded-md text-white text-center`}
                  style={{ backgroundColor: categoryColors[getAqiCategory(highestAQI)] }}>
                  <div>
                    <h2 className="text-4xl font-bold">{highestAQI}</h2>
                    <p className="text-lg">
                      {getAqiCategory(highestAQI).replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </p>
                    <p className="text-sm mt-2">
                      {highestAQI > ALERT_THRESHOLD
                        ? `Air quality is dangerously high. Limit outdoor activities and wear masks.`
                        : highestAQI > aqiCategories.unhealthy.max
                        ? `Air quality is unhealthy. Consider reducing prolonged outdoor activities.`
                        : highestAQI > aqiCategories.moderate.max
                        ? `Air quality is moderate. Sensitive individuals should reduce outdoor exertion.`
                        : "Air quality is good. Enjoy your day!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AQI Trend Chart */}
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl p-4">
            <div className="w-full">
              <h6 className="font-bold text-center mb-4">AQI Trend (Last 24 hr)</h6>
              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex-1 h-64 border border-gray-300 dark:border-gray-600">
                  <canvas ref={trendChartRef} className="h-full w-full"></canvas>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    selectedDate === "today"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                  onClick={() => setSelectedDate("today")}
                >
                  Today
                </button>
                <button
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                    selectedDate === "yesterday"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                  onClick={() => setSelectedDate("yesterday")}
                >
                  Yesterday
                </button>
              </div>
            </div>
          </div>
          
          {/* Major Pollutants Section */}
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl p-4">
            <h5 className="text-center font-bold mb-4">Major Pollutants</h5>
            <div className="flex flex-wrap justify-around">
              {aqiData && aqiData.pollutants ? (
                <>
                  <PollutantBox name="PM2.5" data={aqiData.pollutants.pm2_5} />
                  <PollutantBox name="PM10" data={aqiData.pollutants.pm10} />
                  <PollutantBox name="O3" data={aqiData.pollutants.o3} />
                  <PollutantBox name="NO2" data={aqiData.pollutants.no2} />
                  <PollutantBox name="SO2" data={aqiData.pollutants.so2} />
                  <PollutantBox name="CO" data={aqiData.pollutants.co} />
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Loading pollutant data...</p>
              )}
            </div>
          </div>
          
          {/* Heatmap */}
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl">
            <div className="flex flex-col h-full">
              <h2 className="text-lg uppercase font-semibold text-center mt-6">
                Heatmap Chart
              </h2>
              <div className="flex items-center justify-center p-4">
                <Heatmap data={heatmapData} width={700} height={400} />
              </div>
            </div>
          </div>
          
          {/* Pollution Reports */}
          <div className="bg-surfaceColor dark:bg-surfaceColor rounded-3xl shadow-2xl">
            <div className="bg-surfaceColor dark:bg-surfaceColor p-4 rounded-2xl h-full">
              <h3 className="text-lg font-semibold text-center uppercase mb-4">
                Recent Pollution Reports
              </h3>

              {status === "loading" ? (
                <p>Loading reports...</p>
              ) : pollutions.filter(r => r.isVerified).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No verified pollution reports available.
                </p>
              ) : (
                <div className="space-y-4">
                  {pollutions
                    .filter(r => r.isVerified)
                    .slice(0, 3)
                    .map((report) => (
                      <div key={report._id} className="bg-white dark:bg-background shadow-md rounded-2xl p-4 border border-gray-300 dark:border-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Pollution Type:
                            </p>
                            <p className="text-lg font-semibold">
                              {report.pollutionType}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Location:
                            </p>
                            <p className="text-lg font-semibold">
                              {report.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Date Reported:
                            </p>
                            <p className="text-lg font-semibold">{report.date}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Status:
                            </p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.resolved ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                            }`}>
                              {report.resolved ? "Resolved" : "Under Review"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-500">
                            Description:
                          </p>
                          <p className="text-gray-800 dark:text-gray-300">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="text-center mt-6">
                <button className="bg-primaryBtnBg text-primaryBtnText font-semibold py-2 px-6 rounded-lg shadow-md transition hover:bg-opacity-90">
                  <NavLink to={"/report"}>View All Reports</NavLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;