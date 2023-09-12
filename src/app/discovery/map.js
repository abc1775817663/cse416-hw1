// components/Map.js
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

import L from "leaflet";

function Map() {
  useEffect(() => {
    const map = L.map("map").setView([0,0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  );
}

export default Map;
