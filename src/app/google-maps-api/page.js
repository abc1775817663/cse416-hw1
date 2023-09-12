"use client";

import './stylesheet.css'
import { useState, useEffect } from "react";

import { handleShapefile } from './handleShapefile';
import { handleGeoJson } from './handleGeoJson';
import { handleKeyhole } from './handleKeyhole';
import GoogleMapsComponent from './googleMapsComponenet';

const SUPPORTED_TYPES = {
    "shp": "Shapefile",
    "json": "GeoJSON",
    "kml": "KML",
    "kmz": "KML"
};


const INITIAL_STATE = {
    hasFile: false,
    type: ""
};

let svg = <svg id="map-display" width="800" height="600"></svg>;


export default function Discovery()
{
    const [state, setState] = useState(INITIAL_STATE);

    function handleChange(event)
    {
        if(event.target.files && event.target.files.length > 0)
        {
            let file = event.target.files[0];

            let ext = file.name.split('.').pop();
            let type = SUPPORTED_TYPES[ext];

            switch(type)
            {
                case "Shapefile":
                    handleShapefile(file);
                    break;
                case "GeoJSON":
                    handleGeoJson(file);
                    break;
                case "KML":
                    handleKeyhole(file);
                    break;
                default:
                    break;
            }

            setState({
                hasFile: true,
                type
            });
        }
        else
        {
            setState({
                ...state,
                hasFile: false
            });
        }
    };

    return (
        <div>
            {/* <script src="https://maps.googleapis.com/maps/api/jskey=AIzaSyAny2W8p1qmkxejIerlPawrtDdnSU3evjs" async defer></script> */}
            <div id="map"></div>
            {<GoogleMapsComponent/>}
            <p>Browse for <b>Shapefile</b>, <b>GeoJSON</b>, or <b>Keyhole (KML)</b> file:</p>
            <input 
                type="file"
                accept={Object.keys(SUPPORTED_TYPES).reduce((acc, current) => acc + "." + current + ",", "")}
                onChange={handleChange}
                />
            {state.hasFile ? 
                <div>
                    <p>Type: {state.type}</p>
                    {svg}
                </div> : null}
        </div>
    );
}