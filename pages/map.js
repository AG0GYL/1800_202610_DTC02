function setup(x = 49.27686984435864, y = -123.11198770925881) {
  var map = L.map("map").setView([x, y], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

$(document).ready(function () {
  setup();
});
