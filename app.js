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
let lastValidPosition = { lat: 20.5937, lng: 78.9629 }; // Default India position

function initMap() {
  // Create map centered on default position
  map = L.map('map').setView([lastValidPosition.lat, lastValidPosition.lng], 15);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Create initial marker
  marker = L.marker([lastValidPosition.lat, lastValidPosition.lng], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }).addTo(map)
    .bindPopup("Waiting for GPS data...")
    .openPopup();

  // Start listening for Firebase updates
  setupFirebaseListener();
}

function setupFirebaseListener() {
  const trackerRef = database.ref('devices/bike_tracker');
  
  trackerRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("Full Firebase Data:", data);
    
    if (data && data.location) {
      const lat = parseFloat(data.location.latitude);
      const lng = parseFloat(data.location.longitude);
      const timestamp = data.timestamp || Math.floor(Date.now()/1000);
      
      if (!isNaN(lat) && !isNaN(lng) {
        lastValidPosition = { lat, lng };
        updateMap(lastValidPosition, timestamp);
      } else {
        console.warn("Invalid coordinates received");
        showWarning("Received invalid coordinates");
      }
    } else {
      console.warn("Incomplete data structure");
      showWarning("Waiting for complete GPS data");
    }
  }, (error) => {
    console.error("Firebase error:", error);
    showWarning("Connection error - using last known position");
  });
}

function updateMap(position, timestamp) {
  // Update marker position
  marker.setLatLng([position.lat, position.lng])
    .setPopupContent(`Last update: ${new Date(timestamp * 1000).toLocaleTimeString()}`)
    .openPopup();
  
  // Smoothly pan to new position
  map.panTo([position.lat, position.lng], {
    animate: true,
    duration: 1
  });
}

function showWarning(message) {
  marker.setPopupContent(message).openPopup();
  document.getElementById('lastUpdate').textContent = message;
}

// Initialize when page loads
window.onload = initMap;
