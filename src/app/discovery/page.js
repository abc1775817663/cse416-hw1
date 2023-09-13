"use client";

import './stylesheet.css'
import { useState, useEffect } from "react";
import GeoJSONDisplay from './handleGeoJson';
import KeyholeDisplay from './handleKeyhole';
import ShapefileDisplay from './handleShapefile';

import L from "leaflet";
import "leaflet/dist/leaflet.css";


const SUPPORTED_TYPES = {
  "shp": "Shapefile",
  "zip": "Shapefile",
  "json": "GeoJSON",
  "kml": "KML",
  "kmz": "KML"
};

const INITIAL_STATE = {
  file: null,
  type: ""
};

export default function Discovery() {
  const [state, setState] = useState(INITIAL_STATE);

  function handleChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      let ext = file.name.split('.').pop();
      if (!SUPPORTED_TYPES.hasOwnProperty(ext)) {
        alert("FILE TYPE NOT SUPPORTED!")
      }
      let type = SUPPORTED_TYPES[ext];

      if (type) {
        setState({
          ...state,
          file,
          type
        });
      }
    }
    else {
      setState({
        ...state,
        file: null
      });
    }
  };

  return (
    <div className="discovery-container">
      <h1>File Discovery</h1>
      <p>Browse for <b>Shapefile</b>, <b>GeoJSON</b>, or <b>Keyhole (KML)</b> file:</p>
      <input
        type="file"
        accept={Object.keys(SUPPORTED_TYPES).reduce((acc, current) => acc + "." + current + ",", "")}
        onChange={handleChange}
      />
      {state.file ?
        <div className="file-details">
          <p>Type: {state.type}</p>
          {state.type === "GeoJSON" && <GeoJSONDisplay file={state.file} />}
          {state.type === "KML" && <KeyholeDisplay file={state.file} />}
          {state.type === "Shapefile" && <ShapefileDisplay file={state.file} />}
        </div>
        : null}
    </div>
  )
}