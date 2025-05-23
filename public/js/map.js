// Initialize and add the map
let map;

async function initMap() {
  // The location of Uluru
  const position = {
    lat: coordinates[1], 
    lng: coordinates[0], 
  }; 
  // Request needed libraries.
  //@ts-ignore
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { Marker } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 8,
    center: position,
    mapId: 'c74e52ae12fe9797c461afb9'
  });

  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  // The marker, positioned at Uluru
  const marker = new Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: position,
    toggleBounce: toggleBounce,
    title: "Listing Location",
  });

  const infoWindow = new InfoWindow({
  content: `
    <div>
      <strong>Listing Location</strong><br>
      Location: ${listingLocation}<br>
      Country: ${listingCountry}
    </div>`
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker); // this works with classic Marker only
  });
  }
initMap();


