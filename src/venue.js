import { db } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { onAuthReady } from "./authentication.js";
import { auth } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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
    const city = venue.city;
    const details = venue.details;
    const photo_url = venue.photo_url;
    const lng = venue.lng;
    const lat = venue.lat;

    // Update the page
    document.getElementById("venueName").textContent = name;
    document.getElementById("venueDetails").textContent = details;
    document.getElementById("venueLocation").textContent = city;
    document.getElementById("venueAboutDescription").textContent = details;

    // Photo carousel
    document.getElementById("photoGalleryCarousel").src = photo_url;
    photoGalleryCarousel.innerHTML = `
      <section
        id="photoGalleryCarousel"
        class="bg-[url(${venue.photo_url})] bg-cover bg-center bg-orange-500/70 w-full flex justify-center h-[300px] rounded-lg"
      >
      </section>`;

    // Venue reviews summary
    if (venue.totalReviews) {
      document.getElementById("venueRatingNumbers").textContent =
        venue.averageRating.toFixed(1);
      document.getElementById("venueReviewCount").textContent =
        venue.totalReviews;
      document.getElementById("venuePricing").textContent = "$".repeat(
        venue.averagePricing,
      );
      for (let i = 1; i <= 5; i++) {
        const star = document.getElementById(`star${i}`);
        if (i <= Math.floor(venue.averageRating)) {
          star.textContent = "star";
        } else if (i === Math.ceil(venue.averageRating)) {
          star.textContent = "star_half";
        } else {
          star.textContent = "star_outline";
        }
      }
      // If there are no reviews yet. Populate with placeholders
    } else {
      document.getElementById("venueRatingNumbers").textContent =
        "No reviews yet";
      document.getElementById("venueReviewCount").textContent = 0;
      document.getElementById("venuePricing").textContent = "—";
    }

    // Header background
    const headerContainer = document.getElementById("headerBackgroundOverlay");
    const firstImage = venue.images?.[0] ?? "path/to/placeholder.jpg";
    if (firstImage != "path/to/placeholder.jpg") {
      headerContainer.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), url(${firstImage})`;
    } else {
      headerContainer.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), url(${venue.photo_url})`;
    }
    headerContainer.classList.add("bg-cover", "bg-center");

    //Photo Carousel
    const images = venue.images; // array of base64 strings
    const carousel = document.getElementById("photoGalleryContainer");
    carousel.innerHTML = "";
    if (images) {
      images.forEach((base64, index) => {
        const img = document.createElement("img");
        img.src = base64; // base64 data URL works directly as src
        img.className = "w-full h-64 object-cover rounded";
        img.alt = `Venue photo ${index + 1}`;
        carousel.appendChild(img);
      });
    } else {
      const img = document.createElement("img");
      img.src = venue.photo_url;
      img.className = "w-full h-64 object-cover rounded";
      img.alt = "Venue photo";
      carousel.appendChild(img);
    }

    //Map Href
    document.getElementById("map").href =
      `./map.html?lat=${lat}&lng=${lng}&zoom=15`;

    // Map
    const map = L.map("mapContainer").setView([lat, lng], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup();
  } catch (error) {
    console.error("Error loading venue:", error);
    document.getElementById("venueName").textContent = "Error loading venue.";
  }
}

displayVenueInfo();

// Save venue document ID into local storage
document.addEventListener("DOMContentLoaded", () => {
  const writeReviewBtn = document.getElementById("writeReviewBtn");
  writeReviewBtn.addEventListener(
    "click",
    saveVenueDocumentIDAndToggleReviewForm,
  );
});

function saveVenueDocumentIDAndToggleReviewForm() {
  const params = new URL(window.location.href);
  const venueID = params.searchParams.get("docID");

  if (!venueID) {
    console.warn("No venue ID found in URL. Cannot continue.");
    return;
  }

  // Toggle review form submission container
  const reviewFormSubmissionContainer = document.getElementById(
    "reviewFormSubmissionContainer",
  );
  reviewFormSubmissionContainer.classList.toggle("hidden");
}

function addReviewForm() {
  const reviewFormSubmissionContainer = document.getElementById(
    "reviewFormSubmissionContainer",
  );
  reviewFormSubmissionContainer.innerHTML = `
  <div class="flex flex-col w-full border-1 border-stone-400 p-4 rounded-lg shadow-md backdrop-blur-sm hover:border-orange-400">
    
    <h2 class="text-2xl font-extrabold mb-4">Write a Review</h2>
 
    <form id="reviewForm" class="flex flex-col gap-4">
 
      <!-- TITLE -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">TITLE</label>
        <input
          type="text"
          id="reviewTitle"
          required
          placeholder="Summarize your experience"
          class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
        />
      </div>
 
      <!-- STAR RATING -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">OVERALL RATING</label>
        <div class="flex gap-1" id="starRatingContainer">
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="1">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="2">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="3">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="4">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="5">star_outline</span>
        </div>
      </div>
 
      <!-- TWO COLUMN: ATMOSPHERE + GROUP SIZE -->
      <div class="flex gap-4">
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">ATMOSPHERE</label>
          <select
            id="atmosphereSelect"
            required
            class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
          >
            <option value="">Select atmosphere type</option>
            <option value="Chill">Chill</option>
            <option value="Moderate">Moderate</option>
            <option value="Lively">Lively</option>
            <option value="High Energy">High Energy</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">GROUP SIZE</label>
          <select
            id="groupSizeSelect"
            required
            class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
          >
            <option value="">Best for what group size</option>
            <option value="Solo">Solo</option>
            <option value="Small Group">Small Group</option>
            <option value="Large Group">Large Group</option>
          </select>
        </div>
      </div>
 
      <!-- TWO COLUMN: PRICING + WOULD YOU VISIT AGAIN -->
      <div class="flex gap-8 w-full">
        <!-- PRICING -->
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">PRICE RANGE</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$" checked class="accent-orange-500" /> $
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$" class="accent-orange-500" /> $$
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$$" class="accent-orange-500" /> $$$
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$$$" class="accent-orange-500" /> $$$$
            </label> 
          </div>
        </div>
        <!-- WOULD YOU VISIT AGAIN -->
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold tracking-wide">WOULD YOU VISIT AGAIN?</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="Yes" class="accent-orange-500" /> Yes
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="No" class="accent-orange-500" /> No
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="Unsure" checked class="accent-orange-500" /> Not sure
            </label>
          </div>
        </div>
      </div>
 
      <!-- REVIEW TEXT -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">YOUR REVIEW</label>
        <textarea
          id="reviewDescription"
          rows="4"
          placeholder="What was the venue like? Any comments for other potential visitors?"
          class="border-2 border-stone-300 rounded-lg p-2 resize-none focus:outline-none focus:border-orange-400"
        ></textarea>
      </div>
 
      <!-- STATUS + SUBMIT ROW -->
      <div class="flex items-center justify-between">
        <p id="reviewStatusMsg" class="text-sm text-orange-500 font-semibold"></p>
        <button
          id="submitReviewBtn"
          type="button"
          class="border-1 p-2 px-5 rounded-lg cursor-pointer border-orange-500 font-semibold hover:border-stone-400/90 hover:bg-transparent hover:text-black bg-orange-500 text-white duration-150 disabled:opacity-50"
        >
          Submit Review
        </button>
      </div>
    </form>
  </div>
</section>
  `;
}

addReviewForm();

// STARS
// make outlined stars filled if clicked
let venueRating = 0;

const stars = document.querySelectorAll(".starIcon");

function highlightStars(rating) {
  stars.forEach((star) => {
    if (rating >= parseInt(star.dataset.value)) {
      star.textContent = "star";
    } else {
      star.textContent = "star_outline";
    }
  });
}

stars.forEach((star) => {
  star.addEventListener("mouseover", () =>
    highlightStars(parseInt(star.dataset.value)),
  );
  star.addEventListener("mouseleave", () => highlightStars(venueRating));
  star.addEventListener("click", () => {
    venueRating = parseInt(star.dataset.value);
    highlightStars(venueRating);
  });
});

//-----------------------------------------------------------
// Get venue ID from Local Storage
// Go to firestore to get the name of the venue (using this ID)
// and display in title of the page
//-----------------------------------------------------------
var venueDocID = new URL(window.location.href).searchParams.get("docID");
// displayVenueName(venueDocID);
async function displayVenueName(id) {
  try {
    const venueRef = doc(db, "venue", id);
    const venueSnap = await getDoc(venueRef);

    if (venueSnap.exists()) {
      const venueName = venueSnap.data().name;
      document.getElementById("venueName").textContent = venueName;
    } else {
      console.log("No such venue found!");
    }
  } catch (error) {
    console.error("Error getting venue document:", error);
  }
}

//---------------------------------------------------------------------
// Function to write review data into Firestore
// Triggered when the authenticated user clicks the "Submit" button
// Collects form data and adds a new document to the selected venue's
// "reviews" subcollection: venue/{venueDocID}/reviews/{reviewDocID}
//---------------------------------------------------------------------

async function writeReview() {
  console.log("Inside write review");

  // 🧾 Collect form data
  const venueTitle = document.getElementById("reviewTitle").value;
  const venueAtmosphere = document.getElementById("atmosphereSelect").value;
  const venueGroupSize = document.getElementById("groupSizeSelect").value;
  const venuePricing = document.querySelector(
    'input[name="pricing"]:checked',
  )?.value;
  const venueWouldVisitAgain = document.querySelector(
    'input[name="wouldVisitAgain"]:checked',
  )?.value;
  const venueDescription = document.getElementById("reviewDescription").value;

  // Log collected data for verification
  console.log("inside write review, rating =", venueRating);
  console.log("venueDocID =", venueDocID);
  console.log("Collected venue data:");
  console.log(
    venueTitle,
    venueAtmosphere,
    venueGroupSize,
    venuePricing,
    venueWouldVisitAgain,
    venueDescription,
  );

  // simple validation
  if (!venueTitle || !venueDescription) {
    alert("Please complete all required fields.");
    return;
  }

  // get a pointer to the user who is logged in
  const user = auth.currentUser;

  if (user) {
    try {
      const userID = user.uid;

      // ✅ Store review as subcollection under this hike
      //   Path: venue/{venueDocID}/reviews/{autoReviewID}
      await addDoc(collection(db, "venue", venueDocID, "reviews"), {
        userID: userID,
        title: venueTitle,
        atmosphere: venueAtmosphere,
        groupSize: venueGroupSize,
        pricing: venuePricing,
        wouldVisitAgain: venueWouldVisitAgain,
        description: venueDescription,
        rating: venueRating,
        timestamp: serverTimestamp(),
      });

      console.log("Review successfully written!");
      // IF REVIEW IS SUCCESSFULLY WRITTEN -> Update/create the venue's review summary.
      await aggregateVenueReviews(venueDocID);

      // Show successfully submitted review
      const reviewStatusMsg = document.getElementById("reviewStatusMsg");
      reviewStatusMsg.innerText = "Your review has been submitted.";
      // Redirect after a few seconds
      setTimeout(() => {
        window.location.href = `/pages/venue.html?docID=${venueDocID}`;
      }, 1500);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  } else {
    console.log("No user is signed in");
    window.location.href = "../pages/login.html";
  }
}

async function aggregateVenueReviews(venueDocID) {
  try {
    // point to venue in Firestore
    const venueRef = doc(db, "venue", venueDocID);
    const venueSnap = await getDoc(venueRef);

    // point to reviews in Firestore
    const venueReviewsRef = collection(db, "venue", venueDocID, "reviews");
    const venueReviewsSnap = await getDocs(venueReviewsRef);

    // Initialize review attributes to none / 0
    let totalReviews = 0;
    let totalRating = 0;
    let totalAtmosphere = {
      Chill: 0,
      Moderate: 0,
      Lively: 0,
      "High Energy": 0,
    };
    let totalGroupSize = { Solo: 0, "Small Group": 0, "Large Group": 0 };
    let totalPricing = 0;
    let totalWouldVisitAgain = { Yes: 0, No: 0, Unsure: 0 };

    // Loop through each review and aggregate
    venueReviewsSnap.forEach((reviewSnap) => {
      const reviewData = reviewSnap.data();
      totalReviews += 1;
      totalRating += reviewData.rating;
      totalAtmosphere[reviewData.atmosphere] += 1;
      totalGroupSize[reviewData.groupSize] += 1;
      totalPricing += reviewData.pricing.length;
      totalWouldVisitAgain[reviewData.wouldVisitAgain] += 1;
    });

    // Find the average data of the aggregated reviews data
    let averageRating = totalRating / totalReviews;

    // Similar to Python's logic of new_max = max(a, b)
    let averageAtmosphere;
    let maxAtmosphereCount = 0;
    for (let key in totalAtmosphere) {
      if (totalAtmosphere[key] > maxAtmosphereCount) {
        averageAtmosphere = key;
        maxAtmosphereCount = totalAtmosphere[key];
      }
    }

    // Similar to Python's logic of new_max = max(a, b)
    let averageGroupSize;
    let maxGroupSizeCount = 0;
    for (let key in totalGroupSize) {
      if (totalGroupSize[key] > maxGroupSizeCount) {
        averageGroupSize = key;
        maxGroupSizeCount = totalGroupSize[key];
      }
    }

    let averagePricing = Math.floor(totalPricing / totalReviews);

    // Similar to Python's logic of new_max = max(a, b)
    let averageWouldVisitAgain;
    let maxWouldVisitAgainCount = 0;
    for (let key in totalWouldVisitAgain) {
      if (totalWouldVisitAgain[key] > maxWouldVisitAgainCount) {
        averageWouldVisitAgain = key;
        maxWouldVisitAgainCount = totalWouldVisitAgain[key];
      }
    }
    // After aggregating reviews. Update/create the fields to the venue's Firestore document
    await updateDoc(venueRef, {
      totalReviews,
      averageRating,
      averageAtmosphere,
      averageGroupSize,
      averagePricing,
      averageWouldVisitAgain,
    });
  } catch (error) {
    console.log("Error aggregating venue reviews!", error);
  }
}

// ADD EVENT LISTENER TO SUBMIT BUTTON
const submitReviewBtn = document.getElementById("submitReviewBtn");
submitReviewBtn.addEventListener("click", writeReview);

async function populateReviews() {
  console.log("test");
  const reviewCardTemplate = document.getElementById("reviewCardTemplate");
  const venueReviewsGoesHere = document.getElementById("venueReviewsGoesHere");

  // Get venue ID from the URL (e.g. ?docID=abc123)
  const params = new URL(window.location.href);
  const venueID = params.searchParams.get("docID");

  if (!venueID) {
    console.warn("No venueID found in URL.");
    return;
  }

  try {
    // Sub-collection path: venue/{venueID}/reviews
    const reviewsRef = collection(db, "venue", venueID, "reviews");

    // Optional: order by timestamp (recommended)
    const q = query(reviewsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    console.log("Found", querySnapshot.size, "reviews");

    querySnapshot.forEach(async (docSnap) => {
      const data = docSnap.data();

      // Fetch reviewer name
      const reviewUserRef = doc(db, "users", data.userID);
      const reviewUserSnapshot = await getDoc(reviewUserRef);

      const userData = reviewUserSnapshot.data();

      // REVIEWER DETAILS
      const reviewUserName = userData.name || "Anonymous";
      // FOR NOW: SET THE AVATAR TO THE FIRST CHAR OF THEIR NAME
      const reviewUserAvatar = userData.name[0] || "A";

      // REVIEW DETAILS
      const venueTitle = data.title || "(No title)";
      const venueAtmosphere = data.atmosphere || "(Not specified)";
      const venueGroupSize = data.groupSize || "(Not specified)";
      const venueDescription = data.description || "";
      const venuePricing = data.pricing ?? "(unknown)";
      const venueWouldVisitAgain = data.wouldVisitAgain ?? "(unknown)";
      const venueRating = Number(data.rating ?? 0);

      // Format the time
      let time = "";
      if (data.timestamp?.toDate) {
        time = data.timestamp.toDate().toLocaleString();
      }

      // Clone the template and fill in the fields
      const reviewCard = reviewCardTemplate.content.cloneNode(true);

      // REVIEWER DETAILS
      reviewCard.querySelector(".reviewUserName").textContent = reviewUserName;
      reviewCard.querySelector(".reviewUserAvatar").textContent =
        reviewUserAvatar;

      // REVIEW DETAILS
      reviewCard.querySelector(".reviewUserTimeStamp").textContent = time;
      reviewCard.querySelector(".reviewUserTitle").textContent = venueTitle;
      reviewCard.querySelector(".reviewUserAtmosphere").textContent =
        venueAtmosphere;
      reviewCard.querySelector(".reviewUserGroupSize").textContent =
        venueGroupSize;
      reviewCard.querySelector(".reviewUserDescription").textContent =
        venueDescription;
      reviewCard.querySelector(".reviewUserPricing").textContent = venuePricing;
      reviewCard.querySelector(".reviewUserWouldVisitAgain").textContent =
        venueWouldVisitAgain;

      // Star rating
      let starRating = "";
      const safeRating = Math.max(0, Math.min(5, venueRating));
      for (let i = 0; i < safeRating; i++) {
        starRating +=
          '<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star</span>';
      }
      for (let i = safeRating; i < 5; i++) {
        starRating +=
          '<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star_outline</span>';
      }
      reviewCard.querySelector(".reviewUseRating").innerHTML = starRating;

      venueReviewsGoesHere.appendChild(reviewCard);
    });
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

populateReviews();

displayVenueOpenStatus();
function isVenueOpen() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 12 || hour < 1;
}

function displayVenueOpenStatus() {
  if (isVenueOpen()) {
    // HERO's open status
    document.getElementById("venueOpenStatus").textContent = "● Open Now";
    document.getElementById("venueOpenStatus").classList.remove("bg-red-600");
    document.getElementById("venueOpenStatus").classList.add("bg-green-600");
    // SCHEDULE's open status
    document.getElementById("venueScheduleOpenStatus").textContent =
      "● Open Now";
    document
      .getElementById("venueScheduleOpenStatus")
      .classList.remove("text-red-600");
    document
      .getElementById("venueScheduleOpenStatus")
      .classList.add("text-green-600");
  } else {
    // HERO's open status
    document.getElementById("venueOpenStatus").textContent = "● Closed";
    document.getElementById("venueOpenStatus").classList.remove("bg-green-600");
    document.getElementById("venueOpenStatus").classList.add("bg-red-600");
    // SCHEDULE's open status
    document.getElementById("venueScheduleOpenStatus").textContent =
      "● Closed Now";
    document
      .getElementById("venueScheduleOpenStatus")
      .classList.remove("text-green-600");
    document
      .getElementById("venueScheduleOpenStatus")
      .classList.add("text-red-600");
  }
}
displayVenueOpenStatus();

function modalPopUp(message) {
  const modal = document.getElementById("popUp");
  // SET TEXT AND REMOVE VISIBLE
  modal.textContent = message;
  modal.classList.remove("opacity-0");
  modal.classList.add("opacity-100");
  setTimeout(() => {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
  }, 2000);
}

function createShareBtn() {
  document
    .getElementById("shareVenueBtn")
    .addEventListener("click", async () => {
      const venueName = document.getElementById("venueName").textContent;
      const shareData = {
        title: venueName,
        text: "Check out this venue on Scout!",
        url: window.location.href,
      };

      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback — copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        console.log("Saved to clipboard!");
        // MODAL POP UP
        modalPopUp("Saved to clipboard!");
      }
    });
}

createShareBtn();

// ACCORDION BEHAVIOR
function accordion() {
  const reviewsDropDown = document.getElementById("reviewsDropDown");
  const venueReviews = document.getElementById("venueReviewsGoesHere");
  const dropdownArrow = reviewsDropDown.querySelector("svg");
  reviewsDropDown.addEventListener("click", () => {
    venueReviews.classList.toggle("hidden");
    dropdownArrow.classList.toggle("rotate-180");
  });
}
accordion();

async function createSaveBtn() {
  const user = auth.currentUser;
  if (!user) return;
  const userID = user.uid;

  const venueID = getDocIdFromUrl();
  const userRef = doc(db, "users", userID);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const bookmark = userData.bookmarks || [];

  const isBookmarked = bookmark.includes(venueID);
  const saveVenueBtn = document.getElementById("saveVenueBtn");
  const path = saveVenueBtn.querySelector("path");

  if (isBookmarked) {
    path.setAttribute("fill", "#f97316");
    console.log("Venue is bookmarked according to user bookmarks!");
  } else {
    path.setAttribute("fill", "none");
    console.log("Venue is not bookmarked according to user bookmarks!");
  }

  saveVenueBtn.addEventListener("click", toggleSaveBtn);
}
async function toggleSaveBtn() {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user is signed in");
    window.location.href = "../pages/login.html";
    return;
  }
  const userID = user.uid;

  const venueID = getDocIdFromUrl();
  const userRef = doc(db, "users", userID);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const bookmarks = userData.bookmarks || [];

  const isBookmarked = bookmarks.includes(venueID);
  const saveVenueBtn = document.getElementById("saveVenueBtn");
  const path = saveVenueBtn.querySelector("path");

  try {
    if (isBookmarked) {
      // Remove from Firestore array
      await updateDoc(userRef, { bookmarks: arrayRemove(venueID) });
      console.log("Removed venue from bookmarks!");
      path.setAttribute("fill", "none");
      // MODAL POP UP
      modalPopUp("Added to Bookmarks!");
    } else {
      // Add to Firestore array
      await updateDoc(userRef, { bookmarks: arrayUnion(venueID) });
      console.log("Added venue to bookmarks!");
      path.setAttribute("fill", "#f97316");
      // MODAL POP UP
      modalPopUp("Removed from Bookmarks!");
    }
  } catch (error) {
    console.log("Error creating save button!");
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    createSaveBtn();
  }
});
