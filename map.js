// map.js - Minimal test version
document.addEventListener('DOMContentLoaded', function() {
  // Initialize map centered on India
  const map = L.map('map').setView([20.5937, 78.9629], 13);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add a test marker
  L.marker([20.5937, 78.9629])
    .addTo(map)
    .bindPopup("Map is working!")
    .openPopup();
  
  console.log("Map initialized successfully!");
});
