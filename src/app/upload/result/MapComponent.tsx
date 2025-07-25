"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

interface MapComponentProps {
  lat: number | null;
  lon: number | null;
  setLat: (lat: number) => void;
  setLon: (lon: number) => void;
}

// Fix for default markers in react-leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

function LocationPicker({ 
  lat, 
  lon, 
  setLat, 
  setLon 
}: {
  lat: number | null;
  lon: number | null;
  setLat: (lat: number) => void;
  setLon: (lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLon(e.latlng.lng);
    },
  });

  return lat && lon ? (
    <Marker
      position={[lat, lon] as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target as L.Marker;
          const position = marker.getLatLng();
          setLat(position.lat);
          setLon(position.lng);
        },
      }}
    />
  ) : null;
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lon, setLat, setLon }) => {
  return (
    <MapContainer
      center={[(lat ?? -6.2), (lon ?? 106.8)] as LatLngExpression}
      zoom={13}
      style={{ height: 300, width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationPicker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
    </MapContainer>
  );
};

export default MapComponent;