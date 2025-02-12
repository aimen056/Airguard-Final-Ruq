import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./HomeMap.css";
import { Icon } from "leaflet";
import gpsIcon from "../assets/gps.png";
import { BsFullscreen } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useAirQuality } from "../context/AirQualityContext";


const HomeMap = ({ markers = [], fullscreen }) => {
  const { airNowData, error } = useAirQuality();

  const customIcon = new Icon({
    iconUrl: gpsIcon,
    iconSize: [36, 36],
  });

  return (
    <div className="relative w-full">
      {/* Fullscreen Button (Hidden in Fullscreen Mode) */}
      {!fullscreen && (
        <NavLink to="/fullscreenMap">
          <button className="absolute top-3 right-3 md:top-5 md:right-5 z-10 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 ring-2 bg-secBtnBg text-secBtnText dark:bg-secBtnBg dark:text-secBtnText rounded-md shadow-lg hover:bg-opacity-80 transition-all">
            <BsFullscreen className="text-lg md:text-xl" />
            <span className="hidden md:inline">Fullscreen</span>
          </button>
        </NavLink>
      )}

      {/* Responsive Map Container */}
      <MapContainer
        className="w-full"
        style={{ height: fullscreen ? "100vh" : "50vh" }} // Adjust for responsiveness
        center={[33.5468, 73.184]}
        zoom={17}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render Markers Only if They Exist */}
        {markers.length > 0 ? (
          markers.map((marker, i) => (
            <Marker key={i} position={marker.geocode} icon={customIcon}>
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 15]}
                className="custom-tooltip"
              >
                {marker.label}
              </Tooltip>
              <Popup className="bg-white dark:bg-gray-800 text-black dark:text-white font-semibold p-3 rounded-lg shadow-md">
                <p>
                  AQI:{" "}
                  {airNowData?.length > 0 ? airNowData[0].AQI : "Loading..."}
                </p>
              </Popup>
            </Marker>
          ))
        ) : (
          <p className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-md">
            No markers available
          </p>
        )}

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

export default HomeMap;
