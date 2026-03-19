import { db } from "./firebaseConfig.js";
import { auth } from "./firebaseConfig.js";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";


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
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" id="star-1">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" id="star-2">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" id="star-3">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" id="star-4">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" id="star-5">star_outline</span>
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
              <input type="radio" name="pricing" value="$" class="accent-orange-500" /> $
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
              <input type="radio" name="wouldYouVisitAgain" value="yes" class="accent-orange-500" /> Yes
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldYouVisitAgain" value="no" class="accent-orange-500" /> No
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldYouVisitAgain" value="unsure" class="accent-orange-500" /> Not sure
            </label>
          </div>
        </div>
      </div>
 
      <!-- REVIEW TEXT -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">YOUR REVIEW</label>
        <textarea
          id="reviewText"
          rows="4"
          required
          placeholder="What was the venue like? Any comments for other potential visitors?"
          class="border-2 border-stone-300 rounded-lg p-2 resize-none focus:outline-none focus:border-orange-400"
        ></textarea>
      </div>
 
      <!-- STATUS + SUBMIT ROW -->
      <div class="flex items-center justify-between">
        <p id="reviewStatusMsg" class="text-sm"></p>
        <button
          id="submitReviewBtn"
          type="submit"
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
