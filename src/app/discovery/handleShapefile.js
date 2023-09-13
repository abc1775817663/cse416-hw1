import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import shp from "shpjs";

export default function ShapefileDisplay(props) {
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
    }

    // Remove old GeoJSON layer if it exists

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
      
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        geoJsonLayerRef.current = L.geoJson(
          { features: [] },
          {
            onEachFeature: (feature, layer) => {
                const label = L.marker(layer.getBounds().getCenter(), {
                  icon: L.divIcon({
                    className: 'countryLabel',
                    html: feature.properties.NAME_2 || feature.properties.NAME_1 || feature.properties.NAME_0,
                    iconSize: [1000, 0],
                    iconAnchor: [0, 0]
                  })
                }).addTo(mapRef.current);
              }
          }
        ).addTo(mapRef.current);

        const data = await shp(event.target.result);

        if (data) {
          geoJsonLayerRef.current.addData(data);
        } else {
          console.error("Shapefile data is null or invalid.");
        }

        console.log(geoJsonLayerRef.current);
        console.log(data);

      } catch (error) {
        console.error("Error:", error);
      }
    };
    reader.readAsArrayBuffer(props.file);
  }, [props.file]);

  return (
    <div
      id={"map" + props.mapId}
      style={{ width: "100%", height: "600px" }}
    ></div>
  );
}