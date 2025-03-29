// Firebase configuration (complete version)
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

// Debugging function
function setupRealtimeUpdates(updateCallback) {
  console.log("Setting up Firebase listener...");
  
  database.ref('current_location').on('value', (snapshot) => {
    const location = snapshot.val();
    console.log("Raw data from Firebase:", location); // Debug log
    
    if (location) {
      console.log("Updating map with:", location.latitude, location.longitude);
      updateCallback({
        lat: location.latitude,
        lng: location.longitude,
        timestamp: location.timestamp || Date.now()
      });
    } else {
      console.warn("Received null location data");
    }
  }, (error) => {
    console.error("Firebase read failed:", error);
  });
}

// For history (optional)
function getLocationHistory(callback) {
  database.ref('location_history').orderByChild('timestamp').limitToLast(50).once('value')
    .then(snapshot => {
      console.log("History data:", snapshot.val());
      callback(snapshot.val());
    })
    .catch(error => console.error("History error:", error));
}
