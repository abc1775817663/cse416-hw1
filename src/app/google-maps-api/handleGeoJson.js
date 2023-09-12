export function handleGeoJson(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const geoJsonData = JSON.parse(event.target.result);

      // Create a map
      const map = new google.maps.Map(document.getElementById("map-display"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      // Add GeoJSON data to the map
      const dataLayer = new google.maps.Data({ map });
      dataLayer.addGeoJson(geoJsonData);

      setState({
        hasFile: true,
        type: "GeoJSON",
      });
    };

    reader.readAsText(file);
  }