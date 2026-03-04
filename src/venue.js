import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

// Get the document ID from the URL
function getDocIdFromUrl() {
  const params = new URL(window.location.href).searchParams;
  return params.get("docID");
}

// Fetch the venue and display its name and image
async function displayVenueInfo() {
  const id = getDocIdFromUrl();

  try {
    const venueRef = doc(db, "venue", id);
    const venueSnap = await getDoc(venueRef);

    const venue = venueSnap.data();
    const name = venue.name;
    const code = venue.code;

    // Update the page
    document.getElementById("venueName").textContent = name;
    const img = document.querySelector("#venueImage");
    img.src = `${venue.photo_url}`;
    img.alt = `${name} image`;
  } catch (error) {
    console.error("Error loading venue:", error);
    document.getElementById("venueName").textContent = "Error loading venue.";
  }
}

displayVenueInfo();
