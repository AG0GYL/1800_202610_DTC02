// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// If you have custom global styles, import them as well:
// import '../styles/style.css';
// document.addEventListener('DOMContentLoaded', sayHello);
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

function toggleDropdown() {
  document.querySelector(`#dropdown`).classList.toggle("hidden");
}

// CLICK OUTSIDE OF DROPDOWN MENU
document.addEventListener("click", (e) => {
  const container = document.querySelector("#avatar-container");
  const dropdown = document.querySelector("#dropdown");

  if (!container.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.bindAuthState();
  }

  renderNavbar() {
    this.innerHTML = `
      <div id="navbar-container" class="sticky top-0 w-full bg-white border-slate-200 border-2 z-50">
        <nav class="px-10 max-w-6xl mx-auto w-full flex justify-between items-center bg-white/90 py-5">

          <h1 class="font-extrabold text-orange-600 text-3xl">
            <a href="/index.html">scout.</a>
          </h1>

          <ul class="justify-between items-center flex gap-2">
            <!-- Create Venue renders here -->
            <li id="create-venue" class="font-semibold text-sm">
              <div class="invisible bg-orange-500 px-3 py-2 rounded-2xl text-white text-sm min-w-[80px]">
                Loading
              </div>
            </li>
          
            <li class="font-semibold text-sm px-3 py-2">
              <a href="/pages/map.html" id="maps-link">Maps</a>
            </li>

            <!-- Auth control renders here -->
            <li id="auth-control" class="font-semibold text-sm">
              <div class="invisible bg-orange-500 px-3 py-2 rounded-2xl text-white text-sm min-w-[80px]">
                Loading
              </div>
            </li>
          </ul>

        </nav>
      </div>
    `;
    this.getLocation();
  }

  getLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        document.getElementById("maps-link").href = `/pages/map.html?lat=${lat}&lng=${lng}&zoom=20&cur=1`;
      },
      function (error) {
        const messages = {
          1: "Location permission denied.",
          2: "Position unavailable.",
          3: "Request timed out."
        };
        console.log(messages[error.code] || "Unknown error.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  bindAuthState() {
    const authControl = this.querySelector("#auth-control");
    const createVenue = this.querySelector("#create-venue");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            name = userData.name;
            email = user.email;
          }
        } catch (error) {
          console.log("Error fetching name!");
        }
        authControl.innerHTML = `
          <!-- dropdown -->
          <div id="avatar-container" class="relative">
            <button id="avatarBtn" class="w-10 h-10 rounded-full bg-orange-500 text-white hover:outline-4 hover:outline-orange-500/25">S</button>
            <div
              class="dropdown absolute right-0 top-15 flex-col bg-white overflow-hidden min-w-[300px] rounded-3xl hidden"
              id="dropdown"
            >
              <div id="dropdown-header" class="px-6 py-3">
                <h2 id="dropdown-name" class="text-2xl font-bold">${user.displayName}</h2>
                <h2 id="dropdown-email" class="text-stone-500">${user.email}</h2>
              </div>
              <div
                class="dropdown-items flex flex-col divide-y divide-gray-300 text-lg font-semibold"
              >
                <a
                  href="../pages/profile.html"
                  class="dropdown-item flex items-center hover:bg-orange-100 gap-3 hover:text-orange-600 px-6 py-3"
                >
                  <svg
                    width="15"
                    height="15"
                    stroke="currentColor"
                    fill="none"
                    stroke-width="2.5"
                  >
                    <use href="/svg/icons.svg#profile" />
                  </svg>
                  Profile
                </a>
                <a
                  href="#"
                  class="dropdown-item flex items-center hover:bg-orange-100 gap-3 hover:text-orange-600 px-6 py-3"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <use href="/svg/icons.svg#settings" />
                  </svg>
                  Settings
                </a>
                <a
                  href="#"
                  id="logoutBtn"
                  class="dropdown-item flex items-center hover:bg-orange-100 gap-3 text-orange-600 px-6 py-3"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <use href="/svg/icons.svg#logout" />
                  </svg>
                  Log out
                </a>
              </div>
            </div>
          </div>
        `;

        createVenue.innerHTML = `
          <a href="/pages/createvenue.html" id="createvenue-link">
          <div id="createvenue_container" class="relative">
            <input type="button" value=" Create Venue" class="bg-orange-500 hover:bg-orange-600 transition px-3 py-2 rounded-2xl text-white text-sm cursor-pointer min-w-[80px]" />            
          </div>
          </a>
        `;
        // AVATAR PROFILE DROPDOWN
        authControl
          .querySelector("#avatarBtn")
          .addEventListener("click", toggleDropdown);




        // DROPDOWN BUTTON
        authControl
          .querySelector("#logoutBtn")
          ?.addEventListener("click", logoutUser);
      } else {
        authControl.innerHTML = `
          <a href="/pages/login.html">
            <input type="button" value="Log in"
              class="bg-orange-500 hover:bg-orange-600 transition px-3 py-2 rounded-2xl text-white text-sm cursor-pointer min-w-[80px]" />
          </a>
        `;

      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
