import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null); // To store the map instance
  const geoJsonLayerRef = useRef(null); // To store the GeoJSON layer

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const jsonData = JSON.parse(event.target.result);
        setGeoJsonData(jsonData);
      } catch (error) {
        console.error("Error parsing GeoJSON:", error);
      }
    };

    reader.readAsText(props.file);
  }, [props.file]);

  useEffect(() => {
    // Initialize the map if it's not already initialized
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add base layer
    }

    // Remove old GeoJSON layer if it exists
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Add new GeoJSON layer if new data exists
    if (geoJsonData) {
      geoJsonLayerRef.current = L.geoJSON(geoJsonData);
      geoJsonLayerRef.current.addTo(mapRef.current);
    }
  }, [geoJsonData]);

  return <div id={"map" + props.mapId} style={{ width: "100%", height: "400px" }}></div>;
}
