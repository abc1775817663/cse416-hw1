const BIG_ENDIAN = 0;
const LITTLE_ENDIAN = 1;

const SHAPE_TYPES = {
    0: "Null",

    1: "Point",
    3: "PolyLine",
    5: "Polygon",
    8: "MultiPoint",

    11: "PointZ",
    13: "PolyLineZ",
    15: "PolygonZ",
    18: "MultiPointZ",

    21: "PointM",
    23: "PolyLineM",
    25: "PolygonM",
    28: "MultiPointM",

    31: "MultiPatch"
};

let intBuffer = null;
let floatBuffer = null;

function getInt(offset, mode)
{
    let buffer = intBuffer;

    if(mode == BIG_ENDIAN)
        return (buffer[offset] << 24) | (buffer[offset+1] << 16) | (buffer[offset+2] << 8) | (buffer[offset+3]);

    if(mode == LITTLE_ENDIAN)
        return (buffer[offset]) | (buffer[offset+1] << 8) | (buffer[offset+2] << 16) | (buffer[offset+3] << 24);
}

function getDouble(offset, mode)
{
    let buffer = floatBuffer;

    if(mode == BIG_ENDIAN)
        return buffer.readDoubleBE(offset);

    if(mode == LITTLE_ENDIAN)
        return buffer.readDoubleLE(offset);
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, ${80}%, ${70}%)`;
}

export function handleShapefile(file)
{
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsArrayBuffer(file);

    function onReaderLoad(event)
    {
        intBuffer = new Uint8Array(event.target.result);
        floatBuffer = Buffer.from(intBuffer);

        let display = document.getElementById("map-display");
        display.innerHTML = "";

        let fileLength = getInt(24, BIG_ENDIAN);
        let shapeType = getInt(32, LITTLE_ENDIAN);

        console.log("file length: " + (fileLength * 2));
        console.log("Shape type: " + SHAPE_TYPES[shapeType]);

        // iterate records
        let offset = 100;
        while(offset < intBuffer.length)
        {
            let recordNumber = getInt(offset, BIG_ENDIAN);
            let contentLength = getInt(offset+4, BIG_ENDIAN);

            console.log("record " + recordNumber + ": " + contentLength*2);
            offset += 8;

            // handle shape here
            switch(SHAPE_TYPES[shapeType])
            {
                case "Polygon":
                    {
                        let numParts = getInt(offset + 36, LITTLE_ENDIAN);
                        let numPoints = getInt(offset + 40, LITTLE_ENDIAN);
                        console.log("\tnumParts: " + numParts);
                        console.log("\tnumPoints: " + numPoints);

                        let xRange = {min: getDouble(36, LITTLE_ENDIAN), max: getDouble(52, LITTLE_ENDIAN)};
                        let yRange = {min: -getDouble(44, LITTLE_ENDIAN), max: -getDouble(60, LITTLE_ENDIAN)};

                        let scale = 80;
                        let margin = 20;

                        scale = Math.min(
                            (display.clientWidth - 2*margin) / Math.abs(xRange.max - xRange.min),
                            (display.clientHeight - 2*margin) / Math.abs(yRange.max - yRange.min)
                        );

                        let xTranslate = -xRange.min*scale + (display.clientWidth - 2*margin - (xRange.max - xRange.min)*scale) / 2 + margin;
                        let yTranslate = -yRange.min*scale + (display.clientHeight - 2*margin - (yRange.max - yRange.min)*scale) / 2 + margin;

                        offset += 44;   // now points at Parts[]

                        for(let i = 0; i < numParts; i++)
                        {
                            let firstPointIndex = getInt(offset + i*4, LITTLE_ENDIAN);
                            let nextPointIndex =
                                i == numParts - 1 ? numPoints : getInt(offset + (i+1)*4, LITTLE_ENDIAN);

                            let polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                            let points = "";

                            for(let i = firstPointIndex; i < nextPointIndex; i++)
                            {
                                let x = getDouble(offset + numParts*4 + i*16, LITTLE_ENDIAN).toFixed(5);
                                let y = -getDouble(offset + numParts*4 + i*16 + 8, LITTLE_ENDIAN).toFixed(5);

                                points += x + "," + y + " ";
                            }

                            polygonElement.setAttribute("points", points);
                            polygonElement.setAttribute("vector-effect", "non-scaling-stroke");
                            polygonElement.style.stroke = "black";
                            polygonElement.style.strokeWidth = "1px";
                            polygonElement.style.fill = getRandomColor();
                            polygonElement.setAttribute("transform", `translate(${xTranslate} ${yTranslate}) scale(${scale} ${scale})`);

                            display.insertBefore(polygonElement, display.children[0]);
                        }

                        offset += numParts*4 + 16*numPoints;    // jump to next record
                    }
                    break;
                default:
                    alert("Not implemented: shapefile/" + SHAPE_TYPES[shapeType]);
                    offset += contentLength * 2;
                    break;
            }
        }
    }
}