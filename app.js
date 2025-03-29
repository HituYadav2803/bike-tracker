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
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Create initial marker
  marker = L.marker([20.5937, 78.9629], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).addTo(map);

  // Start listening for Firebase updates
  setupFirebaseListener();
}

// Replace the setupFirebaseListener function with this:

function setupFirebaseListener() {
  // Correct path to match your Firebase structure
  const locationRef = database.ref('devices/bike_tracker/location');
  const timestampRef = database.ref('devices/bike_tracker/timestamp');
  
  locationRef.on('value', (locationSnapshot) => {
    timestampRef.once('value').then((timeSnapshot) => {
      const location = locationSnapshot.val();
      const timestamp = timeSnapshot.val();
      
      console.log("Raw location data:", location);
      console.log("Raw timestamp data:", timestamp);

      if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        updateMap({
          lat: location.latitude,
          lng: location.longitude,
          timestamp: timestamp || Date.now()
        });
      } else {
        console.warn("Invalid location data:", location);
        // Default to India coordinates if data is bad
        updateMap({
          lat: 20.5937,
          lng: 78.9629,
          timestamp: Date.now()
        });
      }
    });
  }, (error) => {
    console.error("Firebase error:", error);
    document.getElementById('lastUpdate').textContent = "Connection error";
  });
}
function updateMap(position) {
  // Update marker position
  marker.setLatLng([position.lat, position.lng]);
  
  // Update timestamp display
  const timeString = new Date(position.timestamp).toLocaleTimeString();
  document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
  
  // Optional: Center map on new position
  map.setView([position.lat, position.lng], 13);
}

// Initialize when page loads
window.onload = initMap;
