export function handleGeoJson(file)
{
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);

    let xRange = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};
    let yRange = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};
    
    function drawLabel(display, name, label, geometry) {

        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = name;
        let fontSize = 12;
        text.style.fontSize = fontSize;
        text.style.textAnchor = "middle";
        text.style.dominantBaseline = "middle";
    
        
        let area;
        switch(geometry.type)
            {
                case "Polygon":
                    {
                        area = calculatePolygonsArea(geometry.coordinates);;
                    }
                    break;
                case "MultiPolygon":
                    {
                        area = calculateMultiPolygonsArea(geometry.coordinates);
                    }
                    break;
                default:
                    alert("Not implemented: geojson/" + geometry.type);
                    return;
        }
        
        const labelThreshold = fontSize * name.length; 
    
        if (area >= labelThreshold) {
            text.setAttribute("x", label.x);
            text.setAttribute("y", -label.y);
            display.appendChild(text);
        }
        else{
            console.log(area, labelThreshold);
        }
    }
    function calculateMultiPolygonsArea(multipolygons){
        let area = 0;
        multipolygons.forEach(multipolygon => {
            area += calculatePolygonsArea(multipolygon);
        })
        return area;
    }
    
    function calculatePolygonsArea(polygons){
        let area = 0;
        polygons.forEach(polygon => {
            area += calculatePolygonArea(polygon);
        })
        return area;
    }
    
    function calculatePolygonArea(polygonCoordinates) {
        // shoelace formula
        let area = 0;

        for (let i = 0; i < polygonCoordinates.length; i++) {
            let xi = polygonCoordinates[i][0];
            let yi = polygonCoordinates[i][1];
            let xi1, yi1;
    
            if (i === polygonCoordinates.length - 1) {
                xi1 = polygonCoordinates[0][0];
                yi1 = polygonCoordinates[0][1];
            } else {
                xi1 = polygonCoordinates[i + 1][0];
                yi1 = polygonCoordinates[i + 1][1];
            }
    
            area += xi * yi1 - xi1 * yi;
        }
    

        return Math.abs(area) / 2;
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
        display.innerHTML = "";
        for(let i = 0; i < obj.features.length; i++)
        {
            let name = obj.features[i].properties.name;
            let label = {x: obj.features[i].properties.label_x, y: obj.features[i].properties.label_y};
            let geometry = obj.features[i].geometry;
            console.log(name);
            console.log(geometry);
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
            drawLabel(display, name, label, geometry);
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
