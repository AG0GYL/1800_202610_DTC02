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

  return Array.from(new Map(results.map((item) => [item.id, item])).values());
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
  const filterBtn = document.getElementById("filterBtn");
  const filterPanel = document.getElementById("filterPanel");


  filterPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });


  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanel.classList.toggle("hidden");
  });

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const term = searchBar.value.trim();
    const level = document.getElementById("levelFilter").value;
    const group = document.getElementById("groupFilter").value;

    const params = new URLSearchParams();

    if (term) params.set("q", term);
    if (level) params.set("averageAtmosphere", level);
    if (group) params.set("averageGroupSize", group);

    window.location.href = `/pages/results.html?${params.toString()}`;
  });

  document.addEventListener("click", (e) => {
    if (!filterPanel.contains(e.target) && !filterBtn.contains(e.target)) {
      filterPanel.classList.add("hidden");
    }
  });
});
