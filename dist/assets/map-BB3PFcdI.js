import{b as z,d as g,e as P,g as $,c as k}from"./navbar-KwjmcJQU.js";/* empty css            */var x=11,v=[],n=L.map("map").setView([49.27686984435864,-123.11198770925881],11);function d(e){return L.divIcon({className:"",html:`
      <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
          fill="${e}" stroke="white" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `,iconSize:[24,36],iconAnchor:[12,36],popupAnchor:[0,-36]})}const i={user:d("red"),result:d("#3b82f6"),selected:d("#22c55e")};L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(n);function D(){const e=new URLSearchParams(window.location.search),t=parseFloat(e.get("lat")),a=parseFloat(e.get("lng")),o=parseInt(e.get("zoom"))||15,r=parseFloat(e.get("cur")),l=e.get("docID");return{lat:t,lng:a,zoom:o,cur:r,docID:l}}const{lat:s,lng:c,zoom:m,cur:h,docID:p}=D();if(!isNaN(h)&&h===1)L.marker([s,c],{icon:i.user}).addTo(n).bindPopup(`
      <span class="font-bold text-orange-500">You're here</span>
      <br>Your current location.
    `).openPopup(),n.setView([s,c],m);else{const e=z(g,"venue",p),t=await P(e),a=t.data().name,o=t.data().details||`Located in ${t.data().city}.`;L.marker([s,c],{icon:i.selected}).addTo(n).bindPopup(`
      <a href="./venue.html?docID=${p}" class="font-bold text-orange-500 hover:underline">
        ${a}
      </a>
      <br>${o}
    `).openPopup(),n.setView([s,c],m)}function u(){var e=n.getZoom(),t=e>=x?1:0;v.forEach(function(a){var o=a.getElement();o&&(o.style.opacity=t);var r=a._shadow;r&&(r.style.opacity=t)})}n.on("zoomend",u);n.on("zoomstart",u);async function I(){try{(await $(k(g,"venue"))).forEach(t=>{const a=t.id,o=t.data(),r=o.lat,l=o.lng,w=o.name,f=o.details||`Located in ${o.city}.`,y=a===p?i.selected:i.result,b=L.marker([r,l],{icon:y}).addTo(n).bindPopup(`
      <a href="./venue.html?docID=${a}" class="font-bold text-orange-500 hover:underline">
        ${w}
      </a>
      <br>${f}
    `);v.push(b)}),u()}catch(e){console.error("Error getting documents: ",e)}}I();
