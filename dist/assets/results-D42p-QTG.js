import{q as g,w as l,c as p,d as m,g as u}from"./navbar-KwjmcJQU.js";import"./searchbar-CHodjZPo.js";const n=new URLSearchParams(window.location.search),x=n.get("q")||"",b=n.get("averageAtmosphere"),y=n.get("averageGroupSize"),$=n.get("averageRating"),A=n.get("averagePricing"),E=n.get("averageWouldVisitAgain"),c=document.getElementById("results");async function L(s,i,t,r,o,d){if(!s.trim())return[];const f=g(p(m,"venue"),l("name",">=",s),l("name","<=",s+"")),h=g(p(m,"venue"),l("city",">=",s),l("city","<=",s+"")),[v,w]=await Promise.all([u(f),u(h)]);let a=Array.from(new Map([...v.docs.map(e=>({id:e.id,...e.data()})),...w.docs.map(e=>({id:e.id,...e.data()}))].map(e=>[e.id,e])).values());return i&&(a=a.filter(e=>e.averageAtmosphere===i)),t&&(a=a.filter(e=>e.averageGroupSize===t)),o&&(a=a.filter(e=>e.averagePricing==o)),d&&(a=a.filter(e=>e.averageWouldVisitAgain===d)),r&&(a=a.filter(e=>e.averageRating>=Number(r))),a}function P(s){if(c.innerHTML="",s.length===0){c.innerHTML=`
      <p class="text-gray-400 text-lg">No results found</p>
    `;return}const i=document.createElement("div");i.className="flex flex-wrap gap-6",s.forEach(t=>{const r=document.createElement("div"),o=t.images?.[0]??"path/to/placeholder.jpg";r.className=`
      rounded-2xl overflow-hidden
      shadow-lg hover:shadow-orange-500/30
      hover:-translate-y-1 transition-all duration-200
      w-[300px]
    `,r.innerHTML=`
  <div class="relative">
    <img 
      src="${t.photo_url||o}" 
      alt="${t.name}" 
      class="w-full h-44 object-cover"
    >

    ${t.averageWouldVisitAgain==="Yes"?`<span class="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white">
            🔥 Popular
          </span>`:""}
  </div>

  <div class="p-4">
    <h3 class="text-lg font-semibold">${t.name}</h3>
    <p class="text-sm text-gray-400 mb-2">${t.city}</p>

    <div class="flex justify-between items-center text-sm mb-3">
      <span class="text-orange-400 font-semibold">
        ⭐ ${Number(t.averageRating||0).toFixed(1)}
      </span>
      <span class="text-gray-300">
        ${"$".repeat(t.averagePricing||2)}
      </span>
    </div>

    <p class="text-xs text-gray-400 mb-3 line-clamp-2">
      ${t.details||""}
    </p>

    <button
      class="view-btn w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition hover:cursor-pointer"
      id="${t.id}"
    >
      View Venue
    </button>
  </div>
`,r.querySelector(".view-btn").addEventListener("click",()=>{window.location.href=`/pages/venue.html?docID=${t.id}`}),i.appendChild(r)}),c.appendChild(i)}L(x,b,y,$,A,E).then(P).catch(s=>{console.error(s),c.innerHTML=`
      <p class="text-red-400">Error loading results</p>
    `});
