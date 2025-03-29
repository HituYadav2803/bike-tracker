import { setupRealtimeUpdates } from './firebase.js';
let map;
let marker;

function initMap() {
  // Initialize map
  map = L.map('map').setView([20.5937, 78.9629], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Initialize marker (empty at first)
  marker = L.marker([0, 0], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32]
    })
  }).addTo(map);

  // Start Firebase updates
  setupRealtimeUpdates(updateMap);
}

function updateMap(position) {
  console.log("Updating map position to:", position); // Debug log
  const newPos = [position.lat, position.lng];
  
  // Update marker
  marker.setLatLng(newPos);
  
  // Update timestamp display
  const timeString = new Date(position.timestamp * 1000).toLocaleTimeString();
  document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
  
  // Optional: Center map
  map.setView(newPos, 13);
}

// Initialize when page loads
window.onload = initMap;
