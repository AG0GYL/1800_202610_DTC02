import { db, auth } from "./firebaseConfig.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

let selectedFiles = [];

document.getElementById("inputImage").addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    selectedFiles = [...selectedFiles, ...files];
    renderPreviews();
    event.target.value = "";
});

function renderPreviews() {
    const preview = document.getElementById("imageDisplay");
    preview.innerHTML = "";

    if (selectedFiles.length === 0) {
        preview.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none"
                stroke="#ff3b30" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                <path d="M10 18l5 -5a1.414 1.414 0 0 0 -2 -2l-5 5v2h2z" />
            </svg>`;
        return;
    }

    const grid = document.createElement("div");
    grid.className = "flex flex-wrap gap-2 mt-2";

    selectedFiles.forEach((file, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "relative w-24 h-24";

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.className = "w-24 h-24 object-cover rounded";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "✕";
        removeBtn.className = "absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";
        removeBtn.addEventListener("click", () => {
            selectedFiles.splice(index, 1);
            renderPreviews();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        grid.appendChild(wrapper);
    });

    preview.appendChild(grid);
}

// Convert a single file to a base64 data URL string
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        // Reject if file is over 200KB to stay safely under Firestore's 1MB limit
        if (file.size > 200 * 1024) {
            reject(new Error(`"${file.name}" is too large. Please use images under 200KB.`));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // keep full data URL (with prefix)
        reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
        reader.readAsDataURL(file);
    });
}

async function geocodeAddress(address) {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&addressdetails=1`;

    const response = await fetch(url, {
        headers: {
            "Accept-Language": "en",
            "User-Agent": "Scout/1.0 (yguo93@my.bcit.ca)"
        }
    });

    if (!response.ok) throw new Error("Geocoding request failed");

    const results = await response.json();
    if (results.length === 0) return null;

    const addr = results[0].address;

    const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        null;

    return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
        city: city,
    };
}

document.getElementById("createVenueForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await createVenue();
});

async function createVenue() {
    const venueTitle = document.getElementById("venueName").value.trim();
    const venueDescription = document.getElementById("venueDescription").value.trim();
    const venueLocation = document.getElementById("venueLocation").value.trim();

    if (!venueTitle || !venueDescription || !venueLocation || selectedFiles.length === 0) {
        alert("Please complete all required fields, including at least one image.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        window.location.href = "../pages/login.html";
        return;
    }

    let coordinates = null;
    try {
        coordinates = await geocodeAddress(venueLocation);
        if (!coordinates) {
            alert("Could not find coordinates for that address. Please try a more specific location.");
            return;
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        alert("Failed to look up the address. Please check your connection and try again.");
        return;
    }

    // Convert all files to base64
    let imageBase64s = [];
    try {
        imageBase64s = await Promise.all(selectedFiles.map(fileToBase64));
    } catch (error) {
        console.error("Image encoding error:", error);
        alert(error.message);
        return;
    }

    try {
        const docRef = await addDoc(collection(db, "venue"), {
            userID: user.uid,
            name: venueTitle,
            location: venueLocation,
            lat: coordinates.lat,
            lng: coordinates.lon,
            city: coordinates.city,
            images: imageBase64s,
            details: venueDescription,
            timestamp: serverTimestamp(),
        });

        console.log("Venue successfully created!", docRef.id);
        alert("Venue created successfully!");

        setTimeout(() => {
            window.location.href = `/pages/venue.html?docID=${docRef.id}`;
        }, 1500);

    } catch (error) {
        console.error("Error creating venue:", error);
        alert("Something went wrong. Please try again.");
    }
}