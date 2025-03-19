import React, { useState } from "react";
import HomeMap from "../components/HomeMap";
import { BsFillArrowRightCircleFill } from "react-icons/bs"; // Icon for the toggle button
//import "./Map.css"; // Import for custom styling

const FullscreenMapPage = () => {
  const [rankingVisible, setRankingVisible] = useState(false);

  // Sample data for zones and AQI
  const zones = [
    { name: "Zone 1", aqi: 120, geocode: [33.5468, 73.184] }, // Added geocode for Zone 1
    { name: "Zone 2", aqi: 180, geocode: [33.5568, 73.194] }, // Added geocode for Zone 2
    { name: "Zone 3", aqi: 90, geocode: [33.5368, 73.174] },  // Added geocode for Zone 3
    { name: "Zone 4", aqi: 50, geocode: [33.5268, 73.164] },  // Added geocode for Zone 4
    { name: "Zone 5", aqi: 200, geocode: [33.5168, 73.154] }, // Added geocode for Zone 5
  ];

  // Sort zones by AQI in descending order
  zones.sort((a, b) => b.aqi - a.aqi);

  const toggleRanking = () => {
    setRankingVisible(!rankingVisible);
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-screen h-screen bg-background dark:bg-background dark:text-[#E4E4E7] relative">
      {/* Button to toggle the ranking visibility */}
      <button
        onClick={toggleRanking}
        className="absolute bottom-0 left-0 bg-blue-600 text-white p-3 rounded-full z-30"
      >
        <BsFillArrowRightCircleFill size={24} />
      </button>

      {/* AQI Ranking Table (visible only when rankingVisible is true) */}
      {rankingVisible && (
        <div className="absolute pt-20 bg-surfaceColor shadow-lg p-4 rounded-lg w-64 z-10">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr>
                <th className="text-left px-2 py-1">Zone</th>
                <th className="text-left px-2 py-1">AQI</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone, index) => (
                <tr key={index}>
                  <td className="px-2 py-1">{zone.name}</td>
                  <td className="px-2 py-1 flex items-center">
                    <div
                      className={`inline-block w-2 h-2 mr-2 rounded-full ${getAqiColor(
                        zone.aqi
                      )}`}
                    ></div>
                    {zone.aqi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map Component with Markers */}
      <HomeMap fullscreen={true} markers={zones} />
    </div>
  );
};

export default FullscreenMapPage;