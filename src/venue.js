import { db } from "./firebaseConfig.js";
import { auth } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
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
    const details = venue.details;
    const code = venue.code;

    // Update the page
    document.getElementById("venueName").textContent = name;
    document.getElementById("venueDetails").textContent = details;

    // venueDetails
    const headerContainer = document.getElementById("headerBackgroundOverlay");
    headerContainer.style.backgroundImage = `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), url(${venue.photo_url})`;

    headerContainer.classList.add(`bg-cover`, `bg-center`);
    // const img = document.querySelector("#venueImage");
    // img.src = `${venue.photo_url}`;
    // img.alt = `${name}`;
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

  // Save the venue ID locally;  provide the key, and the value
  localStorage.setItem("venueDocID", venueID);

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
            <option value="chill">Chill</option>
            <option value="moderate">Moderate</option>
            <option value="lively">Lively</option>
            <option value="highEnergy">High Energy</option>
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
            <option value="solo">Solo</option>
            <option value="smallGroup">Small Group</option>
            <option value="largeGroup">Large Group</option>
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
              <input type="radio" name="wouldVisitAgain" value="yes" class="accent-orange-500" /> Yes
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="no" class="accent-orange-500" /> No
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="unsure" checked class="accent-orange-500" /> Not sure
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
// Go to firestore to get the name of the vene (using this ID)
// and display in title of the page
//-----------------------------------------------------------
var venueDocID = localStorage.getItem("venueDocID");
displayVenueName(venueDocID);
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
      // Path: venue/{venueDocID}/reviews/{autoReviewID}
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

// ADD EVENT LISTENER TO SUBMIT BUTTON
const submitReviewBtn = document.getElementById("submitReviewBtn");
submitReviewBtn.addEventListener("click", writeReview);
