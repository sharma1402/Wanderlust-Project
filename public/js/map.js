// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = {
    lng: coordinates[0],
    lat: coordinates[1]
  }; 
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: position,
    mapId: 'c74e52ae12fe9797c461afb9'
  });
  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Listing Location",
  });
}
initMap();


