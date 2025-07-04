// Initialize and add the map
let map;

(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: mapToken,
  v: "weekly",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

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
   marker.addListener("dblclick", () => {
    marker.setAnimation(
      marker.getAnimation() ? null : google.maps.Animation.BOUNCE
    );
  });
}
initMap();


