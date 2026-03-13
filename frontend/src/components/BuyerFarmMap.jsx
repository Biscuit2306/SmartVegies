import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for Leaflet icons in React
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const BuyerFarmMap = ({ onClose }) => {
  const [distance, setDistance] = useState(50); // Default 50km
  const userLocation = [19.076, 72.877]; // Default: Mumbai (In real app, use navigator.geolocation)

  // Mock Data for Hackathon
  const allFarms = [
    { id: 1, name: "Ramesh Patil Farm", position: [19.15, 72.95], veggies: "Tomatoes", dist: 15 },
    { id: 2, name: "Green Valley", position: [19.45, 72.80], veggies: "Organic Carrots", dist: 45 },
    { id: 3, name: "Nashik Organic Hub", position: [19.99, 73.78], veggies: "Onions", dist: 150 },
  ];

  const filteredFarms = allFarms.filter((farm) => farm.dist <= distance);

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <div className="map-modal-header">
          <h3>Nearby Farms</h3>
          <div className="filter-group">
            <label>Range: {distance}km</label>
            <select value={distance} onChange={(e) => setDistance(Number(e.target.value))}>
              <option value={10}>10 km</option>
              <option value={30}>30 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
          <button className="close-map-btn" onClick={onClose}>&times;</button>
        </div>

        <MapContainer center={userLocation} zoom={9} className="dashboard-leaflet-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* User Location Marker */}
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Range Circle */}
          <Circle center={userLocation} radius={distance * 1000} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }} />

          {filteredFarms.map((farm) => (
            <Marker key={farm.id} position={farm.position}>
              <Popup>
                <div className="map-popup">
                  <h4>{farm.name}</h4>
                  <p><strong>Fresh:</strong> {farm.veggies}</p>
                  <p>Distance: ~{farm.dist}km</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BuyerFarmMap;