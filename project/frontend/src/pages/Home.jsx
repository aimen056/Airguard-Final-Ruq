import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import DropletIcon from "../assets/icons/droplet.svg";
import SpeedometerIcon from "../assets/icons/speedometer.svg";
import ThermometerIcon from "../assets/icons/thermometer.svg";
import HomeMap from "../components/HomeMap"; 

const HomePage = () => {
  const [aqiData, setAqiData] = useState(null);
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [selectedDate, setSelectedDate] = useState("today");
  const [highestAQI, setHighestAQI] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formattedMarkers, setFormattedMarkers] = useState([]);

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

  useEffect(() => {
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
    if (!selectedZone) return;

    const fetchAqiData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/api/aqi?zone=${selectedZone}&date=${selectedDate}`
        );
        console.log("API Response:", response.data);
        setAqiData(response.data);

        if (response.data.pollutants) {
          const maxAQI = Math.max(...response.data.pollutants.map((p) => p.aqi));
          setHighestAQI(maxAQI);
        }
      } catch (error) {
        console.error("Error fetching AQI data:", error);
        setAqiData(null);
      }
    };

    fetchAqiData();
    const interval = setInterval(fetchAqiData, 60000);
    return () => clearInterval(interval);
  }, [selectedZone, selectedDate]);

  useEffect(() => {
    const fetchSensorLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/sensor-locations");
        const formatted = response.data.map(location => ({
          geocode: [location.lat, location.lon],
          label: location.zone
        }));
        setFormattedMarkers(formatted);
      } catch (error) {
        console.error("Error fetching sensor locations:", error);
      }
    };

    fetchSensorLocations();
  }, []);

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

    if (trendChartRef.current && aqiData.trend) {
      trendChartInstance.current = new Chart(trendChartRef.current, {
        type: "line",
        data: {
          labels: aqiData.trend.map((data) => data.time),
          datasets: [
            {
              label: "AQI Trend",
              data: aqiData.trend.map((data) => data.aqi),
              borderColor: "#FF5733",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }
  }, [aqiData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const zone = Object.keys(locationToZoneMapping).find(
      (zone) => zone.toLowerCase() === query
    );
    if (zone) {
      setSelectedZone(zone);
    } else {
      alert("Zone not found. Please enter a valid zone.");
    }
  };

  return (
    <div>
      <header className="bg-gray-100 py-2 border-b border-gray-300">
        <div className="w-full px-2 py-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h5 className="font-bold text-lg text-gray-800 flex items-center">
              🌤️ CHECK YOUR AIR QUALITY TODAY!
            </h5>
            <form onSubmit={handleSearch} className="mt-2 lg:mt-0">
              <input
                type="text"
                className="mt-2 lg:mt-0 p-2 border border-gray-400 rounded w-[500px] bg-white"
                placeholder="Search your zone, location here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      <div className="w-full px-4 my-4">
      <div className="relative w-full h-[410px]">  {/* Added pb-4 for spacing below */}
  {/* HomeMap positioned behind everything */}
  <div className="absolute inset-0 z-0">
    <HomeMap markers={formattedMarkers} />
  </div>

  {/* Gauge Box */}
  <div className="absolute top-5 left-5 bg-white shadow-md p-4 rounded-lg w-52 text-center z-10">
    <h6 className="font-semibold">{selectedZone} Air Quality Index</h6>
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
    <p
  className="font-medium"
  style={{ color: categoryColors[getAqiCategory(highestAQI)] }}
>
  {aqiData ? getAqiCategory(highestAQI) : "Loading..."}
</p>
  </div>

  {/* Deathbox */}
  <div className="absolute bottom-20 right-12 bg-red-600 text-white p-3 rounded-lg w-52 shadow-md text-center z-10">
    <p>Air Pollution has caused an estimated</p>
    <h6 className="text-xl font-bold">128,000</h6>
    <p>Deaths each year in Pakistan</p>
  </div>

  {/* Category Colors */}
  <div className="absolute bottom-0 left-0 w-full flex pb-4">
    {Object.entries(categoryColors).map(([key, color]) => (
      <span
        key={key}
        className="flex-1 text-center py-1 text-white"
        style={{ backgroundColor: color, borderRadius: "4px" }}
      >
        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
      </span>
    ))}
  </div>
</div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 bg-cyan-100 text-center rounded-lg shadow-sm border border-gray-400 h-[150px]">
              <h6 className="font-bold text-cyan-600">
                <img src={DropletIcon} alt="Droplet" className="inline-block mr-2 h-5 w-5" />
                Humidity
              </h6>
              <p className="text-lg font-semibold">
                {aqiData ? `${aqiData.humidity}%` : "Loading..."}
              </p>
            </div>
            <div className="p-5 bg-blue-100 text-center rounded-lg shadow-sm border border-gray-400 h-[150px]">
              <h6 className="font-bold text-purple-600">
                <img src={SpeedometerIcon} alt="Speedometer" className="inline-block mr-2 h-5 w-5" />
                Pressure
              </h6>
              <p className="text-lg font-semibold">
                {aqiData ? `${aqiData.pressure} hPa` : "Loading..."}
              </p>
            </div>
            <div className="col-span-2 p-5 bg-gray-100 text-center rounded-lg shadow-sm border border-gray-400 h-[150px]">
              <h6 className="font-bold text-gray-600">
                <img src={ThermometerIcon} alt="Thermometer" className="inline-block mr-2 h-5 w-5" />
                Temperature
              </h6>
              <p className="text-lg font-semibold">
                {aqiData ? `${aqiData.temperature}°C` : "Loading..."}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl shadow-xl border border-gray-300">
            <h6 className="font-bold text-center mb-4">AQI Trend (Last 24 hr)</h6>
            <div className="flex items-center gap-6">
              <div className="w-2/4 bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
                <h6 className="text-lg font-semibold text-gray-800 text-center mb-3">Filter</h6>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date:</label>
                <div className="flex space-x-2 mb-3">
                  <button
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                      selectedDate === "today"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedDate("today")}
                  >
                    Today
                  </button>
                  <button
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                      selectedDate === "yesterday"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedDate("yesterday")}
                  >
                    Yesterday
                  </button>
                </div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Select Zone:</label>
                <select
                  className="px-2 py-1 border border-gray-300 rounded-md w-full bg-white shadow-sm text-gray-800 text-sm hover:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                >
                  <option value="Zone 1">Zone 1</option>
                  <option value="Zone 2">Zone 2</option>
                  <option value="Zone 3">Zone 3</option>
                  <option value="Zone 4">Zone 4</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg w-4/6 flex items-center justify-center h-64 border border-gray-300">
                <canvas ref={trendChartRef} className="h-full"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 p-4 bg-white shadow-md rounded-lg border border-gray-400">
            <h5 className="text-center font-bold mb-4">Major Pollutants</h5>
            <div className="flex flex-wrap justify-around">
              {aqiData &&
                aqiData.pollutants &&
                aqiData.pollutants.map((pollutant, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-full border-2 border-gray-300 w-28 h-28"
                  >
                    <h6 className="font-bold text-blue-600">{pollutant.name}</h6>
                    <p className="text-lg font-semibold">{pollutant.aqi}</p>
                    <small className="text-gray-500">µg/m³</small>
                  </div>
                ))}
            </div>
          </div>

          <div
  className="p-4 rounded-lg shadow-md text-white"
  style={{
    backgroundColor: categoryColors[getAqiCategory(highestAQI)],
  }}
>
  <h5 className="text-center font-bold mb-3">
    {getAqiCategory(highestAQI) === "good"
      ? "🌿 Air Quality is Good 🌿"
      : getAqiCategory(highestAQI) === "moderate"
      ? "⚠️ Air Quality is Moderate ⚠️"
      : getAqiCategory(highestAQI) === "unhealthySensitive"
      ? "🚨 Air Quality is Unhealthy for Sensitive Groups 🚨"
      : getAqiCategory(highestAQI) === "unhealthy"
      ? "⚠️ Air Quality is Unhealthy ⚠️"
      : getAqiCategory(highestAQI) === "veryUnhealthy"
      ? "🚨 Air Quality is Very Unhealthy 🚨"
      : "☢️ Air Quality is Hazardous ☢️"}
  </h5>
  <p className="text-center">
    {highestAQI > ALERT_THRESHOLD
      ? `Air quality is dangerously high with an AQI of ${highestAQI}. Limit outdoor activities and wear masks.`
      : highestAQI > aqiCategories.unhealthy.max
      ? `Air quality is unhealthy with an AQI of ${highestAQI}. Consider reducing prolonged outdoor activities.`
      : highestAQI > aqiCategories.moderate.max
      ? `Air quality is moderate with an AQI of ${highestAQI}. Unusually sensitive individuals should consider reducing prolonged outdoor exertion.`
      : "Air quality is good. Enjoy your day!"}
  </p>
</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;