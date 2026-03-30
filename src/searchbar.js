import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function searchVenues(searchTerm) {
  if (!searchTerm.trim()) return [];

  const term = searchTerm;

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

  const [nameSnapshot, citySnapshot] = await Promise.all([
    getDocs(nameQuery),
    getDocs(cityQuery),
  ]);

  const results = [
    ...nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    ...citySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  ];

  const uniqueResults = Array.from(
    new Map(results.map((item) => [item.id, item])).values(),
  );

  console.log("Searching for:", term);
  console.log("Results:", uniqueResults);
  

  return uniqueResults;
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const resultsContainer = document.getElementById("results");
  

  let timeout;

  searchBar.addEventListener("input", () => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      const results = await searchVenues(searchBar.value);
      displayResults(results, resultsContainer);
    }, 300);
  });

  function displayResults(results, container) {
    container.innerHTML = "";

    if (results.length === 0) {
      container.innerHTML = "<p>No results found</p>";
      return;
    }

    results.forEach((venue) => {
      const div = document.createElement("div");

      div.classList.add("result-card");

      div.innerHTML = `
        <h3>${venue.name}</h3>
        <p>${venue.city}</p>
        <img src="${venue.photo_url}" width="200">
      `;

      container.appendChild(div);
    });
  }
});


const results = await searchVenues("Vancouver");
console.log(results)