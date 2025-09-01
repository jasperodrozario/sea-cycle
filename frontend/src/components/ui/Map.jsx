"use client";

import React, { useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Custom Icon Definitions
const createIcon = (url) =>
  L.icon({
    iconUrl: url,
    iconSize: [46, 56],
    iconAnchor: [23, 56],
    popupAnchor: [0, -56],
  });

const normalIcon = createIcon("/buoy_green.svg");
const elevatedIcon = createIcon("/buoy_yellow.svg");
const criticalIcon = createIcon("/buoy_red.svg");
const overflowingIcon = createIcon("/buoy_brown.svg");

const getBuoyIcon = (status) => {
  switch (status) {
    case "Critical":
      return criticalIcon;
    case "Elevated":
      return elevatedIcon;
    case "Overflowing":
      return overflowingIcon;
    default:
      return normalIcon;
  }
};

const BuoyMarker = ({ buoy }) => {
  const markerRef = useRef(null);
  const map = useMap();

  const eventHandlers = useMemo(
    () => ({
      click: () => {
        map.flyTo([buoy.gps.latitude, buoy.gps.longitude], 14);
      },
      mouseover() {
        if (markerRef.current) {
          markerRef.current.openPopup();
        }
      },
      mouseout() {
        if (markerRef.current) {
          markerRef.current.closePopup();
        }
      },
    }),
    [map, buoy.gps.latitude, buoy.gps.longitude]
  );

  return (
    <Marker
      ref={markerRef}
      position={[buoy.gps.latitude, buoy.gps.longitude]}
      icon={getBuoyIcon(buoy.fill_status)}
      eventHandlers={eventHandlers}
    >
      <Popup>
        <div className="font-sans">
          <b>Buoy ID:</b> {buoy.buoy_id} <br />
          <b>Status:</b> {buoy.fill_status} <br />
          <b>Fill Level:</b> {buoy.fill_level_percent}% <br /> <br />
          <b>Location:</b> <br />
          <b>Latitude:</b> {buoy.gps.latitude} <br />
          <b>Longitude:</b> {buoy.gps.longitude}
        </div>
      </Popup>
    </Marker>
  );
};

const Map = ({ buoys }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const position = [22.27, 91.8]; // Initial map center

  const filteredBuoys = useMemo(() => {
    if (!searchTerm) return buoys;
    return buoys.filter(
      (buoy) =>
        buoy.buoy_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buoy.fill_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (buoy.location &&
          buoy.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [buoys, searchTerm]);

  return (
    <div className="relative h-full w-full z-0">
      <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
        <Input
          type="search"
          placeholder="Search by Buoy ID, status, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredBuoys.map((buoy) => (
          <BuoyMarker key={buoy.buoy_id} buoy={buoy} />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
