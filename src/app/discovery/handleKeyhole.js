import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";
import tj from 'togeojson';
// import { DOMParser } from 'xmldom';

export default function KeyholeDisplay(props) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const mapRef = useRef(null);
  const geoJsonLayerRef = useRef(null);


  useEffect(() => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        let jsonData;
          console.log(typeof(event.target.result));
          const parser = new DOMParser();
          const kml = parser.parseFromString(event.target.result, 'text/xml');
        //   console.log(event.target);
          console.log("Bewtween parse");
          console.log(typeof(kml));

        //   const kml = new DOMParser().parseFromString(fs.readFileSync("foo.kml", "utf8"));

          jsonData = tj.kml(kml);
          console.log("Successfully parsed from kml to geojson");
        
        setGeoJsonData(jsonData);
      } catch (error) {
        console.error("Error parsing file:", error);
      }
    };

    reader.readAsText(props.file);
  }, [props.file, props.fileType]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map" + props.mapId).setView([0, 0], 2);
    }

    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    if (geoJsonData) {
        console.log(geoJsonData);
      geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
        onEachFeature: (feature, layer) => {
          const label = L.marker(layer.getBounds().getCenter(), {
            icon: L.divIcon({
              className: 'countryLabel',
              html: feature.properties.name,
              iconSize: [1000, 0],
              iconAnchor: [0, 0]
            })
          }).addTo(mapRef.current);
        }
      });

      geoJsonLayerRef.current.addTo(mapRef.current);
    }
  }, [geoJsonData]);

  return (
    <div id={"map" + props.mapId} style={{ width: "100%", height: "600px" }}></div>
  );
}
