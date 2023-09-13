import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";
import shp from "shpjs";

export default function ShapefileDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null); // To store the map instance
  const geoJsonLayerRef = useRef(null); // To store the GeoJSON layer

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
    }
  
    const reader = new FileReader();
  
    reader.onload = async function (event) {
      try {
        const geo = L.geoJson(
          { features: [] },
          {
            onEachFeature: function popUp(f, l) {
            },
          }
        ).addTo(mapRef.current);
  
        const data = await shp(event.target.result);
        
        if (data) {
          geo.addData(data);
        } else {
          console.error("Shapefile data is null or invalid.");
        }
        
        console.log(geo);
        console.log(data);
  
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    reader.readAsArrayBuffer(props.file);
  
  }, [props.file]);
  

//   useEffect(() => {
//     // Initialize the map if it's not already initialized
//     if (!mapRef.current) {
//       mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
//       // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current); // Add base layer
//     }

//     // Remove old GeoJSON layer if it exists
//     if (geoJsonLayerRef.current) {
//       mapRef.current.removeLayer(geoJsonLayerRef.current);
//     }

//     // Add new GeoJSON layer if new data exists
//     if (geoJsonData) {
//       geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
//         //add label to each feature
//         onEachFeature: (feature, layer) => {
//           var label = L.marker([feature.properties.label_y, feature.properties.label_x], {
//             icon: L.divIcon({
//                 className: 'countryLabel',
//                 html: feature.properties.name,
//                 iconSize: [1000, 0],
//                 iconAnchor: [0, 0]
//             })
//         }).addTo(mapRef.current);
//           // if(feature.properties && feature.properties.name)
//           // {
//           //   let marker = new L.marker([feature.properties.label_y, feature.properties.label_x], {opacity: 0.01});
//           //   marker.bindTooltip(feature.properties.name, {permanent: true, className: "my-label", offset: [0, 0] });
//           //   marker.addTo(mapRef.current);
//           //   layer.bindPopup(feature.properties.name);
//           // }
//         }
//       });
//       geoJsonLayerRef.current.addTo(mapRef.current);
//     }
//   }, [geoJsonData]);

  return (
    <div
      id={"map" + props.mapId}
      style={{ width: "100%", height: "600px" }}
    ></div>
  );
}
