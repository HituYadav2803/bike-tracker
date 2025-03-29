// Initialize Firebase
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

// Map variables
let map;
let marker;

function initMap() {
  // Create map centered on default position (India)
  map = L.map('map', {
    preferCanvas: true // Better for frequent updates
  }).setView([20.5937, 78.9629], 15);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    crossOrigin: true // Important for CORS
  }).addTo(map);

  // Create marker
  marker = L.marker([20.5937, 78.9629], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      crossOrigin: true // Important for CORS
    })
  }).addTo(map);

  // Start Firebase listener
  setupFirebaseListener();
}

function setupFirebaseListener() {
  const locationRef = database.ref('devices/bike_tracker/location');
  
  locationRef.on('value', (snapshot) => {
    const location = snapshot.val();
    console.log('Firebase data:', location);
    
    if (location && location.latitude && location.longitude) {
      updateMap({
        lat: location.latitude,
        lng: location.longitude,
        timestamp: Date.now()
      });
    } else {
      console.warn('Invalid location data');
      document.getElementById('lastUpdate').textContent = 'Waiting for valid data...';
    }
  }, (error) => {
    console.error('Firebase error:', error);
    document.getElementById('lastUpdate').textContent = 'Connection error';
  });
}

function updateMap(position) {
  // Update marker
  marker.setLatLng([position.lat, position.lng]);
  
  // Update display
  const timeString = new Date(position.timestamp).toLocaleTimeString();
  document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
  
  // Smooth pan to new location
  map.panTo([position.lat, position.lng], {
    animate: true,
    duration: 1
  });
}

// Initialize when page loads
window.addEventListener('load', initMap);
