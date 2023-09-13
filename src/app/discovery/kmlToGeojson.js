const tj = require('togeojson');
const DOMParser = require('xmldom').DOMParser;

function convertKMLToGeoJSON(kmlData) {
  const kmlParser = new DOMParser();
  const kmlDoc = kmlParser.parseFromString(kmlData);
  const geojson = tj.kml(kmlDoc);

  return geojson;
}

module.exports = convertKMLToGeoJSON;
