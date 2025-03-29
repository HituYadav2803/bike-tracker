import { initializeApp } from 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDZbu3cGDDMpoJwhIO03SugABdZVpBt0YM",
  authDomain: "hf-dlx-bike-automation.firebaseapp.com",
  databaseURL: "https://hf-dlx-bike-automation-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hf-dlx-bike-automation",
  storageBucket: "hf-dlx-bike-automation.appspot.com",
  messagingSenderId: "640094593084",
  appId: "1:640094593084:web:9d300c58d31c3dadf8a339"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Named export for setupRealtimeUpdates
export function setupRealtimeUpdates(updateCallback) {
  console.log("Setting up Firebase listener...");
  const locationRef = ref(database, 'current_location');
  
  onValue(locationRef, (snapshot) => {
    const location = snapshot.val();
    console.log("Received location:", location);
    if (location) {
      updateCallback({
        lat: location.latitude,
        lng: location.longitude,
        timestamp: location.timestamp || Date.now()
      });
    }
  }, {
    onlyOnce: false
  });
}

// Named export for getLocationHistory (if needed)
export function getLocationHistory(callback) {
  const historyRef = ref(database, 'location_history');
  // ... (your history implementation)
}
