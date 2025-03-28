import { setupRealtimeUpdates, getLocationHistory } from './firebase.js';

// Map variables
let map;
let marker;
let polyline;
const path = [];

// Initialize map
function initMap() {
  // Set up OpenStreetMap
  map = L.map('map').setView([20.5937, 78.9629], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Custom bike icon
  const bikeIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Set up real-time updates
  setupRealtimeUpdates(updateMap);

  // Control buttons
  document.getElementById('centerBtn').addEventListener('click', centerOnBike);
  document.getElementById('historyBtn').addEventListener('click', toggleHistory);
}

// Update map with new location
function updateMap(position) {
  const latLng = [position.lat, position.lng];
  
  if (!marker) {
    // Create new marker
    marker = L.marker(latLng, {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
        iconSize: [32, 32]
      })
    }).addTo(map);
    marker.bindPopup("Bike Location");
  } else {
    // Update existing marker
    marker.setLatLng(latLng);
  }

  // Update path
  path.push(latLng);
  updatePath();

  // Update timestamp
  const date = new Date(position.timestamp * 1000);
  document.getElementById('lastUpdate').textContent = 
    `Last updated: ${date.toLocaleTimeString()}`;
}

function updatePath() {
  // Remove existing polyline
  if (polyline) {
    map.removeLayer(polyline);
  }
  
  // Draw new path if we have at least 2 points
  if (path.length > 1) {
    polyline = L.polyline(path, {
      color: 'red',
      weight: 3,
      opacity: 0.7
    }).addTo(map);
  }
}

function centerOnBike() {
  if (marker) {
    map.setView(marker.getLatLng(), 15);
  }
}

function toggleHistory() {
  getLocationHistory(history => {
    if (history) {
      const historyPath = Object.values(history).map(item => [item.latitude, item.longitude]);
      L.polyline(historyPath, {color: 'blue', weight: 2}).addTo(map);
    }
  });
}

// Initialize when page loads
window.onload = initMap;


// Service Worker Registration (add this at the end)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }