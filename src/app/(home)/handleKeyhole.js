import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";
import tj from 'togeojson';

export default function KeyholeDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const markers = useRef([]);

  const fitMapToGeoJsonBounds = () => {
    if (mapRef.current && geoJsonLayerRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      mapRef.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        let jsonData;
        const parser = new DOMParser();
        const kml = parser.parseFromString(event.target.result, 'text/xml');
        jsonData = tj.kml(kml);
        setGeoJsonData(jsonData);
      } catch (error) {
        console.error("Error parsing file:", error);
      }
    };
    reader.readAsText(props.file);
  }, [props.file, props.fileType]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId);
    }
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }
    markers.current.forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    markers.current = [];

    if (geoJsonData) {
      console.log(geoJsonData);
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        onEachFeature: (feature, layer) => {
          if (feature.properties.name) {
            var htmlData = feature.properties.name;
          }else{
            htmlData = "Area: " + feature.properties.shape_area;
          }
            const label = L.marker(layer.getBounds().getCenter(), {
              icon: L.divIcon({
                className: 'countryLabel',
                html: htmlData,
                iconSize: [1000, 0],
                iconAnchor: [0, 0]
              })
            }).addTo(mapRef.current);
            markers.current.push(label);
        }
      });

      geoJsonLayerRef.current.addTo(mapRef.current);
      fitMapToGeoJsonBounds();
    }
  }, [geoJsonData]);

  useEffect(() => {
    window.addEventListener("resize", fitMapToGeoJsonBounds);

    return () => {
      window.removeEventListener("resize", fitMapToGeoJsonBounds);
    };
  }, []);

  return (
    <div id={"map" + props.mapId} style={{ width: "100%", height: "600px" }}></div>
  );
}
