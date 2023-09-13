import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import shp from "shpjs";

export default function ShapefileDisplay(props) {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);
  const countryMarkers = useRef([]);
  const stateMarkers = useRef([]);
  const cityMarkers = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
    }

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Clear existing markers
    [...countryMarkers.current, ...stateMarkers.current, ...cityMarkers.current].forEach((marker) => {
      mapRef.current.removeLayer(marker);
    });
    countryMarkers.current = [];
    stateMarkers.current = [];
    cityMarkers.current = [];

    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const data = await shp(event.target.result);

        if (data) {
          geoJsonLayerRef.current = L.geoJson(data, {
            onEachFeature: (feature, layer) => {
              if (feature.properties.NAME_2) {
                const countryLabel = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                    className: 'countryLabel',
                    html: feature.properties.NAME_2,
                    iconSize: [1000, 0],
                    iconAnchor: [0, 0]
                  })
                });
                countryMarkers.current.push(countryLabel);

              }
              else if (feature.properties.NAME_1) {
                const stateLabel = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                    className: 'stateLabel',
                    html: feature.properties.NAME_1,
                    iconSize: [1000, 0],
                    iconAnchor: [0, 0]
                  })
                });
                stateMarkers.current.push(stateLabel);
              }
              else if (feature.properties.NAME_0) {
                const cityLabel = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                    className: 'cityLabel',
                    html: feature.properties.NAME_0,
                    iconSize: [1000, 0],
                    iconAnchor: [0, 0]
                  })
                });
                cityMarkers.current.push(cityLabel);
              }
            }
          }).addTo(mapRef.current);

          // Add zoom listener here
          mapRef.current.on('zoomend', function () {
            const zoom = mapRef.current.getZoom();

            // Clear all markers first
            [...countryMarkers.current, ...stateMarkers.current, ...cityMarkers.current].forEach(marker => mapRef.current.removeLayer(marker));

            // Add markers based on zoom level
            if (zoom > 7) {
              countryMarkers.current.forEach(marker => marker.addTo(mapRef.current));
            } else if (zoom > 5) {
              stateMarkers.current.forEach(marker => marker.addTo(mapRef.current));
            } else {
              cityMarkers.current.forEach(marker => marker.addTo(mapRef.current));
            }
          });
        } else {
          console.error("Shapefile data is null or invalid.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    reader.readAsArrayBuffer(props.file);
  }, [props.file]);

  return (
    <div id={"map" + props.mapId} style={{ width: "100%", height: "600px" }}></div>
  );
}
