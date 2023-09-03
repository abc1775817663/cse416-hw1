export function handleGeoJson(file)
{
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);

    function drawPolygon(display, polygon)
    {
        let polygonsvg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        let points = "";
        let scale = 3.5;
        polygon.forEach(point => points += `${point[0]*scale + 600},${-point[1]*scale + 350} `);
        polygonsvg.setAttribute("points", points);
        polygonsvg.style.stroke = "black";
        polygonsvg.style.strokeWidth = "1px";
        polygonsvg.style.fill = "none";
        polygonsvg
        display.appendChild(polygonsvg);
    }

    function onReaderLoad(event)
    {
        const obj = JSON.parse(event.target.result);
        for(let i = 0; i < obj.features.length; i++)
        {
            let name = obj.features[i].properties.name;
            let geometry = obj.features[i].geometry;
            console.log(name);
            console.log(geometry);
            switch(geometry.type)
            {
                case "Polygon":
                    {
                        let display = document.getElementById("map-display");
                        geometry.coordinates.forEach(polygon => {
                            drawPolygon(display, polygon);
                        });
                    }
                    break;
                case "MultiPolygon":
                    {
                        let display = document.getElementById("map-display");
                        geometry.coordinates.forEach(multipolygon => {
                            multipolygon.forEach(polygon => {
                                drawPolygon(display, polygon);
                            });
                        });
                    }
                    break;
                default:
                    alert("Not implemented: geojson/" + geometry.type);
                    return;
            }
        }
    }
}
