import { db } from "../src/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

var FADE_ZOOM = 11;
var markers = [];

var map = L.map("map").setView([49.27686984435864, -123.11198770925881], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));
  const zoom = parseInt(params.get("zoom")) || 15;
  return { lat, lng, zoom };
}

const { lat, lng, zoom } = getUrlParams();

if (!isNaN(lat) && !isNaN(lng)) {
  map.setView([lat, lng], zoom);
  // Add a highlighted marker at the venue
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("You came from a venue page.")
    .openPopup();
}

function updateMarkers() {
  var zoom = map.getZoom();
  var opacity = zoom >= FADE_ZOOM ? 1 : 0;
  markers.forEach(function (m) {
    var el = m.getElement();
    if (el) el.style.opacity = opacity;
    var shadow = m._shadow;
    if (shadow) shadow.style.opacity = opacity;
  });
}

map.on("zoomend", updateMarkers);
map.on("zoomstart", updateMarkers);

async function displayPins() {
  try {
    const querySnapshot = await getDocs(collection(db, "venue"));
    querySnapshot.forEach((doc) => {
      const venueId = doc.id;
      const venue = doc.data();
      const lat = venue.lat;
      const lng = venue.lng;
      const venueName = venue.name;
      const details = venue.details || `Located in ${venue.city}.`;

      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
          <a href="./venue.html?docID=${venueId}" class="font-bold text-orange-500 hover:underline">
            ${venueName}
          </a>
          <br>${details}
        `);

      markers.push(marker);
    });
    updateMarkers();
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

displayPins();