"use client";

import { useState } from "react";

export default function Discovery()
{
    let file = null;
    
    const [type, setType] = useState("");

    const handleChange = (event) => {
        if(event.target.files)
        {
            file = event.target.files[0];

            let ext = file.name.split('.').pop()

            switch(ext)
            {
                case "shp":
                    setType("Shapefile");
                    break;
                case "json":
                    setType("GeoJSON");
                    break;
                case "kml":
                case "kmz":
                    setType("KML");
                    break;
                default:
                    setType("invalid");
                    break;
            }
        }
    };

    return (
        <div>
            <p>Browse for <b>Shapefile</b>, <b>GeoJSON</b>, or <b>Keyhole (KML)</b> file:</p>
            <input 
                type="file"
                onChange={handleChange}
                />
            {type != "" ? <p>Type: {type}</p> : null}
        </div>
    );
}