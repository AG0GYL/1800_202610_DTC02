import { db } from "../src/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

var FADE_ZOOM = 11;
var markers = [];

var map = L.map("map").setView([49.27686984435864, -123.11198770925881], 11);

function createColoredPin(color) {
  return L.divIcon({
    className: "",
    html: `
      <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
          fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36], // tip of the pin
    popupAnchor: [0, -36],
  });
}

const icons = {
  user: createColoredPin("red"), // orange
  result: createColoredPin("#3b82f6"), // blue
  selected: createColoredPin("#22c55e"), // green
};

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const lat = parseFloat(params.get("lat"));
  const lng = parseFloat(params.get("lng"));
  const zoom = parseInt(params.get("zoom")) || 15;
  const cur = parseFloat(params.get("cur"));
  return { lat, lng, zoom, cur };
}

const { lat, lng, zoom, cur } = getUrlParams();

if (!isNaN(lat) && !isNaN(lng)) {
  map.setView([lat, lng], zoom);
  // Add a highlighted marker at the venue
  if (!isNaN(cur) && cur === 1) {
    L.marker([lat, lng], { icon: icons.user })
      .addTo(map)
      .bindPopup("Selected Venue")
      .openPopup();
  } else {
    L.marker([lat, lng]).addTo(map).bindPopup("You're here").openPopup();
  }
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

      const marker = L.marker([lat, lng]).addTo(map).bindPopup(`
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
