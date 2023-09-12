"use client";

import './stylesheet.css'
import { useState, useEffect } from "react";
import GeoJSONDisplay from './handleGeoJson';

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
    type: "",
    mapId: 0
};


export default function Discovery()
{
    const [state, setState] = useState(INITIAL_STATE);

    function handleChange(event)
    {
        if(event.target.files && event.target.files.length > 0)
        {
            let file = event.target.files[0];

            let ext = file.name.split('.').pop();
            if (!SUPPORTED_TYPES.hasOwnProperty(ext)){
                alert("FILE TYPE NOT SUPPORTED!")
            }
            let type = SUPPORTED_TYPES[ext];

            if (type)
            {
                setState({
                    ...state,
                    file,
                    type,
                    mapId: state.mapId + 1
                });
            }
        }
        else
        {
            setState({
                ...state,
                file: null
            });
        }
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
              {state.type === "GeoJSON" && <GeoJSONDisplay file={state.file} mapId={state.mapId}/>}
            </div>
            : null}
        </div>
      )
      
}