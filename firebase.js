// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZbu3cGDDMpoJwhIO03SugABdZVpBt0YM",
    databaseURL: "https://hf-dlx-bike-automation-default-rtdb.asia-southeast1.firebasedatabase.app"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Export Firebase functions
  export function setupRealtimeUpdates(updateCallback) {
    database.ref('current_location').on('value', (snapshot) => {
      const location = snapshot.val();
      if (location) {
        updateCallback({
          lat: location.latitude,
          lng: location.longitude,
          timestamp: location.timestamp
        });
      }
    });
  }
  
  export function getLocationHistory(callback) {
    database.ref('location_history').orderByChild('timestamp').limitToLast(50).once('value')
      .then(snapshot => callback(snapshot.val()));
  }