import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  ZoomControl,
  Circle
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./HomeMap.css";
import { Icon } from "leaflet";
import gpsIcon from "../assets/gps.png";
import { BsFullscreen } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const HomeMap = (props) => {
  const categoryColors = {
    good: "#70E000",
    moderate: "#FEDD00",
    unhealthySensitive: "#FE7434",
    unhealthy: "#F41C34",
    veryUnhealthy: "#B4418E",
    hazardous: "#7B0D1E",
  };

  // Increased radius for better visibility (in meters)
  const SENSOR_COVERAGE_RADIUS = 150; // Increased from 50 to 150 meters

  const customIcon = new Icon({
    iconUrl: gpsIcon,
    iconSize: [36, 36],
  });

  return (
    <div style={{ position: "relative" }}>
      {!props.fullscreen && (
        <NavLink to="/fullscreenMap">
          <button className="flex items-center gap-2 absolute top-2 right-2 z-10 p-2 ring-2 bg-secBtnBg text-secBtnText dark:bg-secBtnBg dark:text-secBtnText rounded-md">
            <BsFullscreen />
            Fullscreen Map
          </button>
        </NavLink>
      )}
      <MapContainer
        style={{ height: props.fullscreen ? "100vh" : "50vh" }}
        center={[33.5468, 73.184]}
        zoom={17}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {props.markers.map((marker, i) => (
          <React.Fragment key={i}>
            <Circle
              center={marker.geocode}
              radius={SENSOR_COVERAGE_RADIUS}
              pathOptions={{
                fillColor: categoryColors[marker.status] || "#70E000",
                color: categoryColors[marker.status] || "#70E000",
                fillOpacity: 0.4,
                weight: 2
              }}
            />
            <Marker position={marker.geocode} icon={customIcon}>
              <Tooltip
                permanent
                direction="bottom"
                offset={[0, 15]}
                className="custom-tooltip"
              >
                {marker.label}
              </Tooltip>
              <Popup className="bg-background dark:bg-surfaceColor text-black dark:text-white font-bold p-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-bold">{marker.locationName || "Unnamed Location"}</span>
                  <span>AQI: {marker.aqi}</span>
                  <span>Status: {marker.status}</span>
                  <span>Coverage: {SENSOR_COVERAGE_RADIUS}m radius</span>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

export default HomeMap;