"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// DEFINING CUSTOM MARKER

// Normal Status Icon (Blue)
const normalIcon = L.icon({
  iconUrl: "/buoy_green.svg",
  iconSize: [46, 56],
  iconAnchor: [15.5, 42],
  popupAnchor: [0, -45],
});

// Elevated Status Icon (Yellow)
const elevatedIcon = L.icon({
  iconUrl: "/buoy_yellow.svg",
  iconSize: [46, 56],
  iconAnchor: [15.5, 42],
  popupAnchor: [0, -45],
});

// Critical Status Icon (Red)
const criticalIcon = L.icon({
  iconUrl: "/buoy_red.svg",
  iconSize: [46, 56],
  iconAnchor: [15.5, 42],
  popupAnchor: [0, -45],
});

// Critical Status Icon (Red)
const overflowingIcon = L.icon({
  iconUrl: "/buoy_brown.svg",
  iconSize: [46, 56],
  iconAnchor: [15.5, 42],
  popupAnchor: [0, -45],
});

const Map = ({ buoys }) => {
  // Set the initial center of the map (e.g., near Chittagong)
  const position = [22.27, 91.8];

  const getBuoyIcon = (status) => {
    if (status === "Critical") return criticalIcon;
    if (status === "Elevated") return elevatedIcon;
    if (status === "Overflowing") return overflowingIcon;
    return normalIcon;
  };

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      {/* This is the background map tile layer. We're using OpenStreetMap. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* This part loops through our buoy data and creates a marker for each one. */}
      {buoys.map((buoy) => (
        <Marker
          key={buoy.buoy_id}
          position={[buoy.gps.latitude, buoy.gps.longitude]}
          icon={getBuoyIcon(buoy.fill_status)}
        >
          <Popup>
            <b>Buoy ID:</b> {buoy.buoy_id} <br />
            <b>Status:</b> {buoy.fill_status} <br />
            <b>Fill Level:</b> {buoy.fill_level_percent}% <br /> <br />
            <b>Location:</b> <br />
            <b>Latitude:</b> {buoy.gps.latitude} <br />
            <b>Longitude:</b> {buoy.gps.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
