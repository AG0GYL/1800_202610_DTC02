// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

// If you have custom global styles, import them as well:
// import '../styles/style.css';

function sayHello() { }
// document.addEventListener('DOMContentLoaded', sayHello);

function addNavBar() {
  const navBar = `
        <div
          id="navbar-container"
          class="sticky top-0 w-full bg-white border-slate-200 border-2"
        >
          <nav
            class="px-10 max-w-6xl mx-auto w-full flex justify-between items-center bg-white/90 py-5"
          >
            <h1 class="font-extrabold text-orange-600 text-3xl"><a href="/index.html">scout.</a></h1>
            <!-- RIGHT SECTION -->
            <ul class="justify-between hidden md:flex">
              <li class="font-semibold text-sm px-3 py-2">
                <a href="/pages/map.html">Maps</a>
              </li>
              <li class="font-semibold text-sm">
                <a href="/pages/login.html"
                  id="Sign"
                  class="bg-orange-500 px-3 py-2 rounded-2xl text-white inline-block">
                  Sign In
                </a>
              </li>
            </ul>
            <!-- COLLAPSIBLE HAMBURGER -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="flex md:hidden"
            >
              <path d="M4 6l16 0" />
              <path d="M4 12l16 0" />
              <path d="M4 18l16 0" />
            </svg>
          </nav>
        </div>
    `;
  $("body").prepend(navBar);
}

$(document).ready(function () {
  addNavBar();
});
