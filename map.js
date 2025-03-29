import { setupRealtimeUpdates } from './firebase.js';

let map;
let marker;

function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  marker = L.marker([0, 0], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32]
    })
  }).addTo(map);

  setupRealtimeUpdates(updateMap);
}

function updateMap(position) {
  console.log("Updating position:", position);
  marker.setLatLng([position.lat, position.lng]);
  document.getElementById('lastUpdate').textContent = 
    `Last updated: ${new Date(position.timestamp).toLocaleTimeString()}`;
}

window.onload = initMap;
