export function handleGeoJson(file)
{
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);

    let xRange = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};
    let yRange = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};

    function drawLabel(display, name, label)
    {
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = name;
        text.setAttribute("x", label.x);
        text.setAttribute("y", -label.y);
        text.style.fontSize = 12;
        text.style.textAnchor = "middle";
        text.style.dominantBaseline = "middle";
        display.appendChild(text);
    }

    function drawPolygon(display, polygon)
    {
        let polygonsvg = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        let points = "";
        
        polygon.forEach(point => {
            let x = point[0];
            let y = -point[1];
            points += x + "," + y + " ";
            if(x < xRange.min) xRange.min = x;
            if(x > xRange.max) xRange.max = x;
            if(y < yRange.min) yRange.min = y;
            if(y > yRange.max) yRange.max = y;
        });

        polygonsvg.setAttribute("points", points);
        polygonsvg.setAttribute("vector-effect", "non-scaling-stroke");

        polygonsvg.style.stroke = "black";
        polygonsvg.style.strokeWidth = "1px";
        polygonsvg.style.fill = "none";

        display.appendChild(polygonsvg);
    }

    function onReaderLoad(event)
    {
        const obj = JSON.parse(event.target.result);
        let display = document.getElementById("map-display");
        for(let i = 0; i < obj.features.length; i++)
        {
            let name = obj.features[i].properties.name;
            let label = {x: obj.features[i].properties.label_x, y: obj.features[i].properties.label_y};
            let geometry = obj.features[i].geometry;
            console.log(name);
            console.log(geometry);

            drawLabel(display, name, label);
            switch(geometry.type)
            {
                case "Polygon":
                    {
                        geometry.coordinates.forEach(polygon => {
                            drawPolygon(display, polygon);
                        });
                    }
                    break;
                case "MultiPolygon":
                    {
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

        let scale = 0;
        let margin = 20;
        
        if(xRange.max - xRange.min > yRange.max - yRange.min)
            scale = (display.clientWidth - 2*margin) / (xRange.max - xRange.min);
        else
            scale = (display.clientHeight - 2*margin) / (yRange.max - yRange.min);

        let xTranslate = -xRange.min*scale + (display.clientWidth - 2*margin - (xRange.max - xRange.min)*scale) / 2 + margin;
        let yTranslate = -yRange.min*scale + (display.clientHeight - 2*margin - (yRange.max - yRange.min)*scale) / 2 + margin;

        Array.from(display.children).forEach(child => {
            if(child.nodeName == "text")
            {
                child.setAttribute("x", child.x.baseVal[0].value * scale + xTranslate);
                child.setAttribute("y", child.y.baseVal[0].value * scale + yTranslate);
            }
            else
                child.setAttribute("transform", `translate(${xTranslate} ${yTranslate}) scale(${scale} ${scale})`);
        });

    }
}
