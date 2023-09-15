import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null); // To store the map instance
  const geoJsonLayerRef = useRef(null); // To store the GeoJSON layer
  const markers = useRef([]);

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
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

    // Add new GeoJSON layer if new data exists
    if (geoJsonData) {
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        // Add label to each feature
        onEachFeature: (feature, layer) => {
          var label = L.marker([feature.properties.label_y, feature.properties.label_x], {
            icon: L.divIcon({
              className: 'countryLabel',
              html: feature.properties.name,
              iconSize: [1000, 0],
              iconAnchor: [0, 0]
            })
          }).addTo(mapRef.current);
          markers.current.push(label);
        }
      });

      geoJsonLayerRef.current.addTo(mapRef.current);

      // Calculate the bounds of the GeoJSON layer
      const bounds = geoJsonLayerRef.current.getBounds();

      // Fit the map to the bounds of the GeoJSON layer
      mapRef.current.fitBounds(bounds);
    }
  }, [geoJsonData]);

  return (
    <div
      id={"map" + props.mapId}
      style={{ width: "100%", height: "600px" }}
    ></div>
  );
}
