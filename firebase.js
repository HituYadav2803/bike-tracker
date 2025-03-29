// Firebase configuration with all required fields
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

// Set authentication persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Export Firebase functions
export function setupRealtimeUpdates(updateCallback) {
  database.ref('current_location').on('value', (snapshot) => {
    const location = snapshot.val();
    if (location) {
      updateCallback({
        lat: location.latitude,
        lng: location.longitude,
        timestamp: location.timestamp || Date.now()
      });
    }
  }, (error) => {
    console.error("Firebase read failed:", error);
  });
}

export function getLocationHistory(callback) {
  database.ref('location_history')
    .orderByChild('timestamp')
    .limitToLast(50)
    .once('value')
    .then(snapshot => callback(snapshot.val()))
    .catch(error => {
      console.error("Error fetching history:", error);
      callback(null);
    });
}

// Error handling wrapper
export function initFirebaseAuth() {
  return new Promise((resolve) => {
    firebase.auth().signInAnonymously()
      .then(() => resolve(true))
      .catch(error => {
        console.error("Anonymous auth failed:", error);
        resolve(false);
      });
  });
}
