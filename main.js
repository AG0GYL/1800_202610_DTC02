import { onAuthReady } from "./src/authentication.js";
import { db } from "./src/firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function showName() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady((user) => {
    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    const name = user.displayName || user.email;

    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `Hi, ${name}! `;
    }
  });
}

function readQuote(day) {
  const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document

  onSnapshot(
    quoteDocRef,
    (docSnap) => {
      // Listen for real-time updates
      if (docSnap.exists()) {
        //Document existence check
        document.getElementById("quote-goes-here").innerHTML =
          docSnap.data().quote;
      } else {
        console.log("No such document!");
      }
    },
    (error) => {
      //Listener/system error
      console.error("Error listening to document: ", error);
    },
  );
}
readQuote("wednesday");

showName();

// Helper function to add the sample Venue documents.
function addVenue() {
  const venueRef = collection(db, "venue");
  console.log("Adding sample Venue data...");
  addDoc(venueRef, {
    code: "BBY01",
    photo_url: "https://picsum.photos/id/237/300/150",
    name: "Burnaby Lake Park Trail",
    city: "Burnaby",
    level: "easy",
    details: "A lovely place for a lunch walk.",
    length: 10,
    Venue_time: 60,
    lat: 49.2467097082573,
    lng: -122.9187029619698,
    last_updated: serverTimestamp(),
  });
  addDoc(venueRef, {
    code: "AM01",
    photo_url: "https://picsum.photos/id/237/300/150",
    name: "Buntzen Lake Trail",
    city: "Anmore",
    level: "moderate",
    details: "Close to town, and relaxing.",
    length: 10.5,
    Venue_time: 80,
    lat: 49.3399431028579,
    lng: -122.85908496766939,
    last_updated: serverTimestamp(),
  });
  addDoc(venueRef, {
    code: "NV01",
    photo_url: "https://picsum.photos/id/237/300/150",
    name: "Mount Seymour Trail",
    city: "North Vancouver",
    level: "hard",
    details: "Amazing ski slope views.",
    length: 8.2,
    Venue_time: 120,
    lat: 49.38847101455571,
    lng: -122.94092543551031,
    last_updated: serverTimestamp(),
  });
  addDoc(venueRef, {
    code: "BBY01",
    photo_url: "https://picsum.photos/id/237/300/150",
    name: "Burnaby Lake Park Trail",
    city: "Burnaby",
    level: "easy",
    details: "A lovely place for a lunch walk.",
    length: 10,
    Venue_time: 60,
    lat: 49.2467097082573,
    lng: -122.9187029619698,
    last_updated: serverTimestamp(),
  });
  addDoc(venueRef, {
    code: "AM01",
    photo_url: "https://picsum.photos/id/237/300/150",
    name: "Buntzen Lake Trail",
    city: "Anmore",
    level: "moderate",
    details: "Close to town, and relaxing.",
    length: 10.5,
    Venue_time: 80,
    lat: 49.3399431028579,
    lng: -122.85908496766939,
    last_updated: serverTimestamp(),
  });
}

// Seeds the "Venues" collection with initial data if it is empty
async function seedVenues() {
  // Get a reference to the "Venues" collection
  const venueRef = collection(db, "venue");

  // Retrieve all documents currently in the collection
  const querySnapshot = await getDocs(venueRef);

  // If no documents exist, the collection is empty
  if (querySnapshot.empty) {
    console.log("Venues collection is empty. Seeding data...");

    // Call function to insert default Venue documents
    addVenue();
  } else {
    // If documents already exist, do not reseed
    console.log("Venues collection already contains data. Skipping seed.");
  }
}

// Call the seeding function when the main.html page loads.
seedVenues();

async function displayCardsDynamically() {
  let cardTemplate = document.getElementById("venueCenuTardTemplate");
  const hikesCollectionRef = collection(db, "venue");

  try {
    const querySnapshot = await getDocs(hikesCollectionRef);
    querySnapshot.forEach((doc) => {
      // Clone the template
      let newcard = venueCardTemplate.content.cloneNode(true);
      // Get hike data once
      const venue = doc.data();

      // Populate the card with hike data
      newcard.querySelector(".card-title").textContent = venue.name;
      newcard.querySelector(".card-text").textContent = 
        venue.details || `Located in ${venue.city}.`;
      newcard.querySelector(".card-length").textContent = venue.length;
      newcard.querySelector(".card-image").textContent = venue.photo_url;
      newcard.querySelector("img").setAttribute("src", `${venue.photo_url}`);
      newcard.querySelector(".read-more").href = `./pages/venue.html?docID=${doc.id}`;
      
      // Attach the new card to the container
      document.getElementById("venue-card-carousel").appendChild(newcard);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// Call the function to display cards when the page loads
displayCardsDynamically();

