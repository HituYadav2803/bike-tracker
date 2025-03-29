// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZbu3cGDDMpoJwhIO03SugABdZVpBt0YM",
  authDomain: "hf-dlx-bike-automation.firebaseapp.com",
  databaseURL: "https://hf-dlx-bike-automation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hf-dlx-bike-automation",
  storageBucket: "hf-dlx-bike-automation.appspot.com",
  messagingSenderId: "640094593084",
  appId: "1:640094593084:web:9d300c58d31c3dadf8a339"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Map Variables
let map;
let marker;

function initMap() {
  // Create map centered on India
  map = L.map('map').setView([20.5937, 78.9629], 13);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}/.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Create initial marker (hidden until we get data)
  marker = L.marker([0, 0], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    }),
    opacity: 0  // Start hidden
  }).addTo(map);

  // Start listening for Firebase updates
  setupFirebaseListener();
}

function setupFirebaseListener() {
  const locationRef = database.ref('devices/bike_tracker/location');
  const timestampRef = database.ref('devices/bike_tracker/timestamp');

  locationRef.on('value', (locationSnapshot) => {
    timestampRef.once('value').then((timeSnapshot) => {
      const location = locationSnapshot.val();
      const timestamp = timeSnapshot.val();

      console.log("Raw Firebase Data - Location:", location);
      console.log("Raw Firebase Data - Timestamp:", timestamp);

      if (location && 
          typeof location.latitude === 'number' && 
          typeof location.longitude === 'number' &&
          !isNaN(location.latitude) && 
          !isNaN(location.longitude)) {
        
        // Make marker visible
        marker.setOpacity(1);
        
        updateMap({
          lat: location.latitude,
          lng: location.longitude,
          timestamp: timestamp || Math.floor(Date.now()/1000)
        });
        
      } else {
        console.warn("Invalid location data received");
        showDefaultLocation();
      }
    }).catch((error) => {
      console.error("Timestamp error:", error);
      showDefaultLocation();
    });
  }, (error) => {
    console.error("Location error:", error);
    showDefaultLocation();
  });
}

function updateMap(position) {
  // Update marker position
  const newPos = [position.lat, position.lng];
  marker.setLatLng(newPos);
  
  // Update timestamp display
  const date = new Date(position.timestamp * 1000);
  const timeString = date.toLocaleTimeString();
  document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
  
  // Center map on new position (optional)
  map.setView(newPos, 15);
}

function showDefaultLocation() {
  updateMap({
    lat: 20.5937,  // India coordinates
    lng: 78.9629,
    timestamp: Math.floor(Date.now()/1000)
  });
  document.getElementById('lastUpdate').textContent = "Waiting for GPS data...";
}

// Initialize when page loads
window.onload = initMap;
