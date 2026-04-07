import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig";

// Get params from URL
const params = new URLSearchParams(window.location.search);

const searchTerm = params.get("q") || "";
const level = params.get("averageAtmosphere");
const group = params.get("averageGroupSize");
const rating = params.get("averageRating");
const price = params.get("averagePricing");
const visit = params.get("averageWouldVisitAgain");

const resultsContainer = document.getElementById("results");

// Fetch + filter venues
async function searchVenues(term, level, group, rating, price, visit) {
  if (!term.trim()) return [];

  const nameQuery = query(
    collection(db, "venue"),
    where("name", ">=", term),
    where("name", "<=", term + "\uf8ff"),
  );

  const cityQuery = query(
    collection(db, "venue"),
    where("city", ">=", term),
    where("city", "<=", term + "\uf8ff"),
  );

  const [nameSnap, citySnap] = await Promise.all([
    getDocs(nameQuery),
    getDocs(cityQuery),
  ]);

  // Merge + remove duplicates
  let results = Array.from(
    new Map(
      [
        ...nameSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...citySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ].map((item) => [item.id, item]),
    ).values(),
  );

  // APPLY FILTERS
  if (level) {
    results = results.filter((v) => v.averageAtmosphere === level);
  }

  if (group) {
    results = results.filter((v) => v.averageGroupSize === group);
  }

  if (price) {
    results = results.filter((v) => v.averagePricing == price);
  }

  if (visit) {
    results = results.filter((v) => v.averageWouldVisitAgain === visit);
  }

  if (rating) {
    results = results.filter((v) => v.averageRating >= Number(rating));
  }

  return results;
}

// Render cards
function displayResults(results) {
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <p class="text-gray-400 text-lg">No results found</p>
    `;
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-wrap gap-6";

  results.forEach((venue) => {
    const div = document.createElement("div");

    div.className = `
      rounded-2xl overflow-hidden
      shadow-lg hover:shadow-orange-500/30
      hover:-translate-y-1 transition-all duration-200
      w-[300px]
    `;

    div.innerHTML = `
      <div class="relative">
        <img 
          src="${venue.photo_url}" 
          alt="${venue.name}" 
          class="w-full h-44 object-cover"
        >

        <span class="
          absolute top-2 left-2 
          bg-black/70 text-xs px-2 py-1 rounded-md text-white
        ">
          ${venue.averageWouldVisitAgain === "Yes" ? "🔥 Popular" : ""}
        </span>
      </div>

      <div class="p-4">
        <h3 class="text-lg font-semibold">${venue.name}</h3>
        <p class="text-sm text-gray-400 mb-2">${venue.city}</p>

        <div class="flex justify-between items-center text-sm mb-3">
          <span class="text-orange-400 font-semibold">
            ⭐ ${Number(venue.averageRating || 0).toFixed(1)}
          </span>
          <span class="text-gray-300">
            ${"$".repeat(venue.averagePricing || 2)}
          </span>
        </div>

        <p class="text-xs text-gray-400 mb-3 line-clamp-2">
          ${venue.details || ""}
        </p>

        <button class="view-btn w-full bg-orange-500 hover:bg-orange-600
        text-white font-semibold py-2 rounded-lg transition hover:cursor-pointer"
          id="${venue.id}"
        ">
          View Venue
        </button>
      </div>
    `;
    
    const button = div.querySelector(".view-btn");

    button.addEventListener("click", () => {
      window.location.href = `/pages/venue.html?docID=${venue.id}`;
    });
    wrapper.appendChild(div);
  });

  resultsContainer.appendChild(wrapper);
}

//  Run search
searchVenues(searchTerm, level, group, rating, price, visit)
  .then(displayResults)
  .catch((err) => {
    console.error(err);
    resultsContainer.innerHTML = `
      <p class="text-red-400">Error loading results</p>
    `;
  });
