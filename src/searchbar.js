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
  document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const term = searchBar.value.trim();
  if (!term) return;

  window.location.href = `/pages/results.html?q=${encodeURIComponent(term)}`;
});
});