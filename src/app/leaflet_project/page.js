"use client";

import './stylesheet.css'
import { useState, useEffect } from "react";
import GeoJSONDisplay from './geoJSONDisplay';

import L from "leaflet";
import "leaflet/dist/leaflet.css";


const SUPPORTED_TYPES = {
    "shp": "Shapefile",
    "json": "GeoJSON",
    "kml": "KML",
    "kmz": "KML"
};

const INITIAL_STATE = {
    file: null,
    type: ""
};





export default function Discovery()
{
    const [state, setState] = useState(INITIAL_STATE);
    const [mapId, setMapId] = useState(0);

    function handleChange(event)
    {
        if(event.target.files && event.target.files.length > 0)
        {
            let file = event.target.files[0];

            let ext = file.name.split('.').pop();
            if (!SUPPORTED_TYPES.hasOwnProperty(fileExtension)){
                alert("FILE TYPE NOT SUPPORTED!")
            }
            let type = SUPPORTED_TYPES[ext];

            if (type)

            setState({
                file,
                type
            });
        }
        else
        {
            setState({
                ...state,
                file: null
            });
        }
        setMapId(mapId+1);
    };

    return (
        <div>
          <p>Browse for <b>Shapefile</b>, <b>GeoJSON</b>, or <b>Keyhole (KML)</b> file:</p>
          <input 
            type="file"
            accept={Object.keys(SUPPORTED_TYPES).reduce((acc, current) => acc + "." + current + ",", "")}
            onChange={handleChange}
          />
          {state.file ? 
            <div>
              <p>Type: {state.type}</p>
              {state.type === "GeoJSON" && <GeoJSONDisplay file={state.file} mapId={mapId}/>}
            </div>
            : null}
        </div>
      )
      
}