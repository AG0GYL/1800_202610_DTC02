import{j as G,i as M,b as S,d as w,e as R,k as _,a as z,c as P,s as F,q as H,n as j,g as q,u as V,p as Y,r as Z}from"./navbar-KwjmcJQU.js";/* empty css            */function N(){return new URL(window.location.href).searchParams.get("docID")}async function X(){const e=N();try{let k=function(){document.getElementById("scheduleList").innerHTML=B.map(n=>{const{open:a,close:f}=v[n];return I?`
        <li class="flex justify-between items-center p-1 gap-2">
          <span class="w-14 text-sm text-stone-600">${n}</span>
          <div class="flex items-center gap-1">
            <input id="open_${n}" value="${a}"
              class="border border-stone-300 rounded px-1 py-0.5 text-xs w-24 focus:outline-none focus:border-orange-400" />
            <span class="text-stone-400 text-xs">–</span>
            <input id="close_${n}" value="${f}"
              class="border border-stone-300 rounded px-1 py-0.5 text-xs w-24 focus:outline-none focus:border-orange-400" />
          </div>
        </li>`:`
      <li class="flex justify-between p-1 text-sm hover:font-semibold duration-150">
        <span>${n}</span><span>${a} – ${f}</span>
      </li>`}).join("")},g=function(){I=!0,document.getElementById("editBtn").classList.add("hidden"),document.getElementById("saveBtn").classList.remove("hidden"),k()};const t=S(w,"venue",e),o=(await R(t)).data(),u=o.name,d=o.city,m=o.details,r=o.photo_url,s=o.lng,i=o.lat;if(document.getElementById("venueName").textContent=u,document.getElementById("venueDetails").textContent=m,document.getElementById("venueLocation").textContent=d,document.getElementById("venueAboutDescription").textContent=m,document.getElementById("photoGalleryCarousel").src=r,photoGalleryCarousel.innerHTML=`
      <section
        id="photoGalleryCarousel"
        class="bg-[url(${o.photo_url})] bg-cover bg-center bg-orange-500/70 w-full flex justify-center h-[300px] rounded-lg"
      >
      </section>`,o.totalReviews){document.getElementById("venueRatingNumbers").textContent=o.averageRating.toFixed(1),document.getElementById("venueReviewCount").textContent=o.totalReviews,document.getElementById("venuePricing").textContent="$".repeat(o.averagePricing);for(let n=1;n<=5;n++){const a=document.getElementById(`star${n}`);n<=Math.floor(o.averageRating)?a.textContent="star":n===Math.ceil(o.averageRating)?a.textContent="star_half":a.textContent="star_outline"}}else document.getElementById("venueRatingNumbers").textContent="No reviews yet",document.getElementById("venueReviewCount").textContent=0,document.getElementById("venuePricing").textContent="—";const p=document.getElementById("headerBackgroundOverlay"),h=o.images?.[0]??"path/to/placeholder.jpg";h!="path/to/placeholder.jpg"?p.style.backgroundImage=`linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), url(${h})`:p.style.backgroundImage=`linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)), url(${o.photo_url})`,p.classList.add("bg-cover","bg-center");const y=o.images,b=document.getElementById("photoGalleryContainer");if(b.innerHTML="",y)y.forEach((n,a)=>{const f=document.createElement("img");f.src=n,f.className="w-full h-64 object-cover rounded",f.alt=`Venue photo ${a+1}`,b.appendChild(f)});else{const n=document.createElement("img");n.src=o.photo_url,n.className="w-full h-64 object-cover rounded",n.alt="Venue photo",b.appendChild(n)}document.getElementById("map").href=`./map.html?lat=${i}&lng=${s}&zoom=15&docID=${e}`;const E=L.map("mapContainer").setView([i,s],15);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(E),L.marker([i,s]).addTo(E).bindPopup(`<b>${u}</b>`).openPopup();const C=o.userID,B=["Mon","Tues","Wed","Thurs","Fri","Sat","Sun"],v={Mon:{open:"12:00 PM",close:"1:00 AM"},Tues:{open:"12:00 PM",close:"1:00 AM"},Wed:{open:"12:00 PM",close:"1:00 AM"},Thurs:{open:"12:00 PM",close:"1:00 AM"},Fri:{open:"12:00 PM",close:"1:00 AM"},Sat:{open:"12:00 PM",close:"1:00 AM"},Sun:{open:"12:00 PM",close:"1:00 AM"}};let I=!1;async function l(){try{const n=S(w,"venue",e),a=await R(n);if(a.exists()&&a.data().schedule){const f=a.data().schedule;B.forEach(D=>{f[D]&&(v[D].open=f[D].open,v[D].close=f[D].close)})}}catch(n){console.error("Failed to load schedule:",n)}k()}async function x(){try{const n=S(w,"venue",e);await _(n,{schedule:v},{merge:!0}),console.log("Schedule saved")}catch(n){console.error("Failed to save schedule:",n)}}async function A(){B.forEach(n=>{v[n].open=document.getElementById(`open_${n}`).value,v[n].close=document.getElementById(`close_${n}`).value}),await x(),I=!1,document.getElementById("editBtn").classList.remove("hidden"),document.getElementById("saveBtn").classList.add("hidden"),k()}window.toggleEdit=g,window.saveSchedule=A,document.getElementById("editBtn").addEventListener("click",g),document.getElementById("saveBtn").addEventListener("click",A),G(M,n=>{const a=n&&n.uid===C;document.getElementById("editBtn").classList.toggle("hidden",!a)}),l()}catch(t){console.error("Error loading venue:",t),document.getElementById("venueName").textContent="Error loading venue."}}X();document.addEventListener("DOMContentLoaded",()=>{document.getElementById("writeReviewBtn").addEventListener("click",J)});function J(){if(!new URL(window.location.href).searchParams.get("docID")){console.warn("No venue ID found in URL. Cannot continue.");return}document.getElementById("reviewFormSubmissionContainer").classList.toggle("hidden")}function K(){const e=document.getElementById("reviewFormSubmissionContainer");e.innerHTML=`
  <div class="flex flex-col w-full border-1 border-stone-400 p-4 rounded-lg shadow-md backdrop-blur-sm hover:border-orange-400">
    
    <h2 class="text-2xl font-extrabold mb-4">Write a Review</h2>
 
    <form id="reviewForm" class="flex flex-col gap-4">
 
      <!-- TITLE -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">TITLE</label>
        <input
          type="text"
          id="reviewTitle"
          required
          placeholder="Summarize your experience"
          class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
        />
      </div>
 
      <!-- STAR RATING -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">OVERALL RATING</label>
        <div class="flex gap-1" id="starRatingContainer">
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="1">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="2">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="3">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="4">star_outline</span>
          <span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer" data-value="5">star_outline</span>
        </div>
      </div>
 
      <!-- TWO COLUMN: ATMOSPHERE + GROUP SIZE -->
      <div class="flex gap-4">
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">ATMOSPHERE</label>
          <select
            id="atmosphereSelect"
            required
            class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
          >
            <option value="">Select atmosphere type</option>
            <option value="Chill">Chill</option>
            <option value="Moderate">Moderate</option>
            <option value="Lively">Lively</option>
            <option value="High Energy">High Energy</option>
          </select>
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">GROUP SIZE</label>
          <select
            id="groupSizeSelect"
            required
            class="border-2 border-stone-300 rounded-lg p-2 focus:outline-none focus:border-orange-400"
          >
            <option value="">Best for what group size</option>
            <option value="Solo">Solo</option>
            <option value="Small Group">Small Group</option>
            <option value="Large Group">Large Group</option>
          </select>
        </div>
      </div>
 
      <!-- TWO COLUMN: PRICING + WOULD YOU VISIT AGAIN -->
      <div class="flex gap-8 w-full">
        <!-- PRICING -->
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold">PRICE RANGE</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$" checked class="accent-orange-500" /> $
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$" class="accent-orange-500" /> $$
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$$" class="accent-orange-500" /> $$$
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="pricing" value="$$$$" class="accent-orange-500" /> $$$$
            </label> 
          </div>
        </div>
        <!-- WOULD YOU VISIT AGAIN -->
        <div class="flex flex-col gap-1 w-1/2">
          <label class="text-stone-600 text-sm font-semibold tracking-wide">WOULD YOU VISIT AGAIN?</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="Yes" class="accent-orange-500" /> Yes
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="No" class="accent-orange-500" /> No
            </label>
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="wouldVisitAgain" value="Unsure" checked class="accent-orange-500" /> Not sure
            </label>
          </div>
        </div>
      </div>
 
      <!-- REVIEW TEXT -->
      <div class="flex flex-col gap-1">
        <label class="text-stone-600 text-sm font-semibold">YOUR REVIEW</label>
        <textarea
          id="reviewDescription"
          rows="4"
          placeholder="What was the venue like? Any comments for other potential visitors?"
          class="border-2 border-stone-300 rounded-lg p-2 resize-none focus:outline-none focus:border-orange-400"
        ></textarea>
      </div>
 
      <!-- STATUS + SUBMIT ROW -->
      <div class="flex items-center justify-between">
        <p id="reviewStatusMsg" class="text-sm text-orange-500 font-semibold"></p>
        <button
          id="submitReviewBtn"
          type="button"
          class="border-1 p-2 px-5 rounded-lg cursor-pointer border-orange-500 font-semibold hover:border-stone-400/90 hover:bg-transparent hover:text-black bg-orange-500 text-white duration-150 disabled:opacity-50"
        >
          Submit Review
        </button>
      </div>
    </form>
  </div>
</section>
  `}K();let T=0;const W=document.querySelectorAll(".starIcon");function $(e){W.forEach(t=>{e>=parseInt(t.dataset.value)?t.textContent="star":t.textContent="star_outline"})}W.forEach(e=>{e.addEventListener("mouseover",()=>$(parseInt(e.dataset.value))),e.addEventListener("mouseleave",()=>$(T)),e.addEventListener("click",()=>{T=parseInt(e.dataset.value),$(T)})});var U=new URL(window.location.href).searchParams.get("docID");async function Q(){console.log("Inside write review");const e=document.getElementById("reviewTitle").value,t=document.getElementById("atmosphereSelect").value,c=document.getElementById("groupSizeSelect").value,o=document.querySelector('input[name="pricing"]:checked')?.value,u=document.querySelector('input[name="wouldVisitAgain"]:checked')?.value,d=document.getElementById("reviewDescription").value;if(console.log("inside write review, rating =",T),console.log("venueDocID =",U),console.log("Collected venue data:"),console.log(e,t,c,o,u,d),!e||!d){alert("Please complete all required fields.");return}const m=M.currentUser;if(m)try{const r=m.uid;await z(P(w,"venue",U,"reviews"),{userID:r,title:e,atmosphere:t,groupSize:c,pricing:o,wouldVisitAgain:u,description:d,rating:T,timestamp:F()}),console.log("Review successfully written!"),await ee(U);const s=document.getElementById("reviewStatusMsg");s.innerText="Your review has been submitted.",setTimeout(()=>{window.location.href=`/pages/venue.html?docID=${U}`},1500)}catch(r){console.error("Error adding review:",r)}else console.log("No user is signed in"),window.location.href="../pages/login.html"}async function ee(e){try{const t=S(w,"venue",e),c=await R(t),o=P(w,"venue",e,"reviews"),u=await q(o);let d=0,m=0,r={Chill:0,Moderate:0,Lively:0,"High Energy":0},s={Solo:0,"Small Group":0,"Large Group":0},i=0,p={Yes:0,No:0,Unsure:0};u.forEach(l=>{const x=l.data();d+=1,m+=x.rating,r[x.atmosphere]+=1,s[x.groupSize]+=1,i+=x.pricing.length,p[x.wouldVisitAgain]+=1});let h=m/d,y,b=0;for(let l in r)r[l]>b&&(y=l,b=r[l]);let E,C=0;for(let l in s)s[l]>C&&(E=l,C=s[l]);let B=Math.floor(i/d),v,I=0;for(let l in p)p[l]>I&&(v=l,I=p[l]);await V(t,{totalReviews:d,averageRating:h,averageAtmosphere:y,averageGroupSize:E,averagePricing:B,averageWouldVisitAgain:v})}catch(t){console.log("Error aggregating venue reviews!",t)}}const te=document.getElementById("submitReviewBtn");te.addEventListener("click",Q);async function ne(){const e=document.getElementById("reviewCardTemplate"),t=document.getElementById("venueReviewsGoesHere"),o=new URL(window.location.href).searchParams.get("docID");if(!o){console.warn("No venueID found in URL.");return}try{const u=P(w,"venue",o,"reviews"),d=H(u,j("timestamp","desc")),m=await q(d);console.log("Found",m.size,"reviews"),m.forEach(async r=>{const s=r.data(),i=S(w,"users",s.userID),h=(await R(i)).data(),y=h.name||"Anonymous",b=h.name[0]||"A",E=s.title||"(No title)",C=s.atmosphere||"(Not specified)",B=s.groupSize||"(Not specified)",v=s.description||"",I=s.pricing??"(unknown)",l=s.wouldVisitAgain??"(unknown)",x=Number(s.rating??0);let k="";s.timestamp?.toDate&&(k=s.timestamp.toDate().toLocaleString());const g=e.content.cloneNode(!0);g.querySelector(".reviewUserName").textContent=y,g.querySelector(".reviewUserAvatar").textContent=b,g.querySelector(".reviewUserTimeStamp").textContent=k,g.querySelector(".reviewUserTitle").textContent=E,g.querySelector(".reviewUserAtmosphere").textContent=C,g.querySelector(".reviewUserGroupSize").textContent=B,g.querySelector(".reviewUserDescription").textContent=v,g.querySelector(".reviewUserPricing").textContent=I,g.querySelector(".reviewUserWouldVisitAgain").textContent=l;let A="";const n=Math.max(0,Math.min(5,x));for(let a=0;a<n;a++)A+='<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star</span>';for(let a=n;a<5;a++)A+='<span class="material-icons starIcon text-orange-400 text-3xl cursor-pointer">star_outline</span>';g.querySelector(".reviewUseRating").innerHTML=A,t.appendChild(g)})}catch(u){console.error("Error loading reviews:",u)}}ne();async function oe(){const e=N();try{const t=S(w,"venue",e),o=(await R(t)).data(),u=new Date,d=u.getDay(),r=["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"][d],s=u.getHours(),i=o.schedule[r]?.open||"12:00 PM",p=o.schedule?.[r]?.close||"1:00 AM",h=parseInt(i.split(":")[0])+(i.includes("PM")&&!i.startsWith("12")?12:0),y=parseInt(p.split(":")[0])+(p.includes("PM")&&!p.startsWith("12")?12:0);return console.log(s>=h&&s<y),s>=h&&s<y}catch(t){return console.error("Error checking venue open status:",t),!1}}async function se(){await oe()?(document.getElementById("venueOpenStatus").textContent="● Open Now",document.getElementById("venueOpenStatus").classList.remove("bg-red-600"),document.getElementById("venueOpenStatus").classList.add("bg-green-600"),document.getElementById("venueScheduleOpenStatus").textContent="● Open Now",document.getElementById("venueScheduleOpenStatus").classList.remove("text-red-600"),document.getElementById("venueScheduleOpenStatus").classList.add("text-green-600")):(document.getElementById("venueOpenStatus").textContent="● Closed",document.getElementById("venueOpenStatus").classList.remove("bg-green-600"),document.getElementById("venueOpenStatus").classList.add("bg-red-600"),document.getElementById("venueScheduleOpenStatus").textContent="● Closed Now",document.getElementById("venueScheduleOpenStatus").classList.remove("text-green-600"),document.getElementById("venueScheduleOpenStatus").classList.add("text-red-600"))}se();function O(e){const t=document.getElementById("popUp");t.textContent=e,t.classList.remove("opacity-0"),t.classList.add("opacity-100"),setTimeout(()=>{t.classList.remove("opacity-100"),t.classList.add("opacity-0")},2e3)}function ae(){document.getElementById("shareVenueBtn").addEventListener("click",async()=>{const t={title:document.getElementById("venueName").textContent,text:"Check out this venue on Scout!",url:window.location.href};try{await navigator.share(t)}catch{navigator.clipboard.writeText(window.location.href),console.log("Saved to clipboard!"),O("Saved to clipboard!")}})}ae();function re(){const e=document.getElementById("reviewsDropDown"),t=document.getElementById("venueReviewsGoesHere"),c=e.querySelector("svg");e.addEventListener("click",()=>{t.classList.toggle("hidden"),c.classList.toggle("rotate-180")})}re();async function ie(){const e=M.currentUser;if(!e)return;const t=e.uid,c=N(),o=S(w,"users",t),r=((await R(o)).data().bookmarks||[]).includes(c),s=document.getElementById("saveVenueBtn"),i=s.querySelector("path");r?(i.setAttribute("fill","#f97316"),console.log("Venue is bookmarked according to user bookmarks!")):(i.setAttribute("fill","none"),console.log("Venue is not bookmarked according to user bookmarks!")),s.addEventListener("click",le)}async function le(){const e=M.currentUser;if(!e){console.log("No user is signed in"),window.location.href="../pages/login.html";return}const t=e.uid,c=N(),o=S(w,"users",t),r=((await R(o)).data().bookmarks||[]).includes(c),i=document.getElementById("saveVenueBtn").querySelector("path");try{r?(await V(o,{bookmarks:Y(c)}),console.log("Removed venue from bookmarks!"),i.setAttribute("fill","none"),O("Removed from Bookmarks!")):(await V(o,{bookmarks:Z(c)}),console.log("Added venue to bookmarks!"),i.setAttribute("fill","#f97316"),O("Added to Bookmarks!"))}catch{console.log("Error creating save button!")}}G(M,e=>{e?ie():document.getElementById("saveVenueBtn").addEventListener("click",()=>{window.location.href="../pages/login.html"})});
