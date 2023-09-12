import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";

export default function GeoJSONDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  


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
    console.log("geoJsonData:", geoJsonData);
    if (geoJsonData) {

      let map = L.map("map" + props.mapId).setView([0, 0], 2);
      
      // Add GeoJSON data to the map
      L.geoJSON(geoJsonData).addTo(map);
    }
  }, [geoJsonData]);

  return <div id={"map" + props.mapId} style={{ width: "100%", height: "400px" }}></div>;
}
