import { onAuthReady } from "./src/authentication.js";
import { db } from "./src/firebaseConfig.js";
import { doc, onSnapshot } from "firebase/firestore";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function showNameAndCity() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady(async (user) => {
    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const name = userData.name || userData.email;
        const city = userData.city || "Vancouver";
        // Update the welcome message with their name/email.
        if (nameElement) {
          nameElement.textContent = `Hi, ${name}! `;
        }
        document.getElementById("userCity").textContent = city;
      }
    } catch (error) {
      console.log("Error fetching name!");
    }
  });
}
// Commenting out readQuote
// function readQuote(day) {
//   const quoteDocRef = doc(db, "quotes", day); // Get a reference to the document
//   onSnapshot(
//     quoteDocRef,
//     (docSnap) => {
//       // Listen for real-time updates
//       if (docSnap.exists()) {
//         //Document existence check
//         document.getElementById("quote-goes-here").innerHTML =
//           docSnap.data().quote;
//       } else {
//         console.log("No such document!");
//       }
//     },
//     (error) => {
//       //Listener/system error
//       console.error("Error listening to document: ", error);
//     },
//   );
// }
// readQuote("wednesday");

showNameAndCity();

// Helper function to add the sample Venue documents.
function addVenue() {
  const venueRef = collection(db, "venue");
  console.log("Adding sample Venue data...");

  addDoc(venueRef, {
    code: "VAN01",
    photo_url:
      "https://www.sharkclub.com/wp-content/uploads/2018/08/Van1-1.jpg",
    name: "Shark Club Sports Bar & Grill",
    city: "Vancouver",
    level: "lively",
    details:
      "Two 12ft HDTV screens and a stadium-quality sound system steps from BC Place and Rogers Arena.",
    length: 0,
    Venue_time: 120,
    lat: 49.278849,
    lng: -123.1129919,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN02",
    photo_url:
      "https://thepintto.com/cdn/shop/files/DSC00889.jpg?v=1700168926&width=1500",
    name: "The Pint Public House",
    city: "Vancouver",
    level: "casual",
    details:
      "Steps from BC Place with 16 rotating beers on tap, famous wing specials, and a lively match-day crowd.",
    length: 0,
    Venue_time: 90,
    lat: 49.2814279,
    lng: -123.1077303,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN04",
    photo_url:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/4c/a7/3e/our-beerhall.jpg?w=900&h=500&s=1",
    name: "BREWHALL",
    city: "Vancouver",
    level: "craft",
    details:
      "Olympic Village craft brewpub with big projector screens, arcade games, and a huge selection of in-house beers.",
    length: 0,
    Venue_time: 120,
    lat: 49.2694506,
    lng: -123.10351750000001,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN05",
    photo_url:
      "https://biminis1975.ca/wp-content/uploads/2025/02/DSC00118-1.jpg",
    name: "Bimini's Since 1975",
    city: "Vancouver",
    level: "casual",
    details:
      "Legendary Kitsilano neighbourhood pub since 1975 with big-screen TVs, daily specials, and retro vibes.",
    length: 0,
    Venue_time: 90,
    lat: 49.2678833,
    lng: -123.1508689,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN06",
    photo_url:
      "https://static.wixstatic.com/media/914129_99ab0f978e0a434ea0185bdc3a9f77f5~mv2.jpg/v1/fill/w_2500,h_1666,al_c/914129_99ab0f978e0a434ea0185bdc3a9f77f5~mv2.jpg",
    name: "The Park Pub",
    city: "Vancouver",
    level: "lively",
    details:
      "West End sports pub with 17 HD screens, all major broadcaster subscriptions, and early 7am weekend opening for international matches.",
    length: 0,
    Venue_time: 120,
    lat: 49.2870025,
    lng: -123.14102929999999,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN07",
    photo_url:
      "https://cdn.prod.website-files.com/62954f7e3328512ebad888a4/63d334087e4bf41fa27ae276_courtside-img.png",
    name: "Courtside Food & Drinks",
    city: "Vancouver",
    level: "upscale",
    details:
      "Trendy Mount Pleasant sports bar with immersive basketball decor, a 15-ft outdoor jumbotron, and elevated stadium eats.",
    length: 0,
    Venue_time: 90,
    lat: 49.2633873,
    lng: -123.1012726,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "VAN08",
    photo_url:
      "https://static.wixstatic.com/media/2cf2fd_9bc26420efb04e1894be04479321c8c7.jpg/v1/fit/w_2500,h_1330,al_c/2cf2fd_9bc26420efb04e1894be04479321c8c7.jpg",
    name: "Red Card Sports Bar + Eatery",
    city: "Vancouver",
    level: "casual",
    details:
      "Charming 1908 building in downtown Vancouver with 16 HD TVs, two projector screens, and an Italian wood-burning pizza oven.",
    length: 0,
    Venue_time: 90,
    lat: 49.2794251,
    lng: -123.12034709999999,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "RMD01",
    photo_url:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/ed/4d/ce/our-house-is-your-house.jpg?w=900&h=500&s=1",
    name: "The Canadian Brewhouse & Grill",
    city: "Richmond",
    level: "family-friendly",
    details:
      "Richmond's go-to sports bar with wall-to-wall TVs, a massive menu, and a welcoming atmosphere for all ages.",
    length: 0,
    Venue_time: 90,
    lat: 49.17762,
    lng: -123.12370999999999,
    last_updated: serverTimestamp(),
  });

  addDoc(venueRef, {
    code: "SUR01",
    photo_url:
      "https://images-dh-production-baselayer.dailyhive.com/uploads/2024/05/image-33-2-e1716413850919.jpg?format=auto&width=988",
    name: "Par4 Kitchen & Bar",
    city: "Surrey",
    level: "upscale",
    details:
      "Surrey's premier sports lounge with golf simulators, elevated global comfort cuisine, and UFC on every screen.",
    length: 0,
    Venue_time: 120,
    lat: 49.1038281,
    lng: -122.8005669,
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
  let cardTemplate = document.getElementById("venueCardTemplate");
  const venuesCollectionRef = collection(db, "venue");

  try {
    const querySnapshot = await getDocs(venuesCollectionRef);
    querySnapshot.forEach((doc) => {
      // Clone the template
      let newcard = cardTemplate.content.cloneNode(true);
      // Get hike data once
      const venue = doc.data();

      // Populate the card with hike data

      newcard.querySelector(".card-title").textContent = venue.name;
      newcard.querySelector(".card-subtitle").textContent =
        venue.city || "Vancouver";
      newcard.querySelector(".card-text").textContent =
        venue.details || `Located in ${venue.city}.`;
      newcard.querySelector(".card-level").textContent = venue.level;

      const firstImage = venue.images?.[0] ?? "path/to/placeholder.jpg";
      if (venue.images?.length && firstImage) {
        newcard.querySelector(".card-image").src = firstImage;
      } else {
        newcard.querySelector(".card-image").textContent = venue.photo_url;
        newcard.querySelector("img").setAttribute("src", `${venue.photo_url}`);
      }
      newcard.querySelector(".read-more").href =
        `./pages/venue.html?docID=${doc.id}`;

      newcard.getElementById("card-overlay").classList.add("text-2xl");
      newcard.getElementById("card-overlay").classList.add("p-2");

      // Attach the new card to the container
      document.getElementById("venue-card-carousel").appendChild(newcard);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

// Call the function to display cards when the page loads
displayCardsDynamically();
