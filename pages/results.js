import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig";

const params = new URLSearchParams(window.location.search);
const searchTerm = params.get("q");
const level = params.get("averageAtmosphere");
const group = params.get("averageGroupSize");

async function searchVenues(term, level, group) {

  const nameQuery = query(
    collection(db, "venue"),
    where("name", ">=", term),
    where("name", "<=", term + "\uf8ff")
  );
  const cityQuery = query(
    collection(db, "venue"),
    where("city", ">=", term),
    where("city", "<=", term + "\uf8ff")
  );

  const [nameSnap, citySnap] = await Promise.all([
    getDocs(nameQuery),
    getDocs(cityQuery)
  ]);


  let results = Array.from(
    new Map(
      [
        ...nameSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...citySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ].map(item => [item.id, item])
    ).values()
  );

  
  if (level) {
    results = results.filter(v => v.averageAtmosphere === level);
  }
  if (group) {
    results = results.filter(v => v.averageGroupSize === group);
  }

  return results;
}

const resultsContainer = document.getElementById("results");

function displayResults(results) {
  resultsContainer.innerHTML = "";
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found</p>";
    return;
  }
  results.forEach(venue => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h2>${venue.name}</h2>
      <p>${venue.city}</p>
      <img src="${venue.photo_url}" width="300">
    `;
    resultsContainer.appendChild(div);
  });
}

if (searchTerm) {
  searchVenues(searchTerm, level, group).then(displayResults);
}