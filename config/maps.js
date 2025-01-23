export const MAPS_CONFIG = {
    apiKey: "AIzaSyCeiu1ZkE95Ler7aYMCifN0cKZ9Xa6EHb0",
    libraries: ["places", "geometry"],
    defaultCenter: { lat: 51.5074, lng: -0.1278 }, // London center
    defaultZoom: 13,
    mapOptions: {
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      fullscreenControl: false,
    },
  }
  
  