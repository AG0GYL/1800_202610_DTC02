// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// If you have custom global styles, import them as well:
// import '../styles/style.css';

function sayHello() {}
// document.addEventListener('DOMContentLoaded', sayHello);
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

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

          <ul class="justify-between items-center hidden md:flex gap-2">
            <li class="font-semibold text-sm px-3 py-2">
              <a href="/pages/map.html">Maps</a>
            </li>
            <!-- Auth control renders here -->
            <li id="auth-control" class="font-semibold text-sm">
              <div class="invisible bg-orange-500 px-3 py-2 rounded-2xl text-white text-sm min-w-[80px]">
                Loading
              </div>
            </li>
          </ul>

          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
            viewBox="0 0 24 24" fill="none" stroke="#000000"
            stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
            class="flex md:hidden cursor-pointer">
            <path d="M4 6l16 0" />
            <path d="M4 12l16 0" />
            <path d="M4 18l16 0" />
          </svg>

        </nav>
      </div>
    `;
  }

  bindAuthState() {
    const authControl = this.querySelector("#auth-control");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        authControl.innerHTML = `
          <button id="signOutBtn"
            class="bg-orange-500 hover:bg-orange-600 transition px-3 py-2 rounded-2xl text-white text-sm min-w-[80px]">
            Log out
          </button>
        `;
        authControl
          .querySelector("#signOutBtn")
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
