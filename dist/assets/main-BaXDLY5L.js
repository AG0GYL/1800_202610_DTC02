import{o as m,c as d,g as u,d as i,a as o,b as g,e as h,s}from"./navbar-KwjmcJQU.js";import"./searchbar-CHodjZPo.js";function y(){const t=document.getElementById("name-goes-here");m(async l=>{try{const n=g(i,"users",l.uid),c=await h(n);if(c.exists()){const a=c.data(),e=a.name||a.email,r=a.city||"Vancouver";t&&(t.textContent=`Hi, ${e}! `),document.getElementById("userCity").textContent=r}}catch{console.log("Error fetching name!")}})}y();function v(){const t=d(i,"venue");console.log("Adding sample Venue data..."),o(t,{code:"VAN01",photo_url:"https://www.sharkclub.com/wp-content/uploads/2018/08/Van1-1.jpg",name:"Shark Club Sports Bar & Grill",city:"Vancouver",level:"lively",details:"Two 12ft HDTV screens and a stadium-quality sound system steps from BC Place and Rogers Arena.",length:0,Venue_time:120,lat:49.278849,lng:-123.1129919,last_updated:s()}),o(t,{code:"VAN02",photo_url:"https://thepintto.com/cdn/shop/files/DSC00889.jpg?v=1700168926&width=1500",name:"The Pint Public House",city:"Vancouver",level:"casual",details:"Steps from BC Place with 16 rotating beers on tap, famous wing specials, and a lively match-day crowd.",length:0,Venue_time:90,lat:49.2814279,lng:-123.1077303,last_updated:s()}),o(t,{code:"VAN04",photo_url:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/4c/a7/3e/our-beerhall.jpg?w=900&h=500&s=1",name:"BREWHALL",city:"Vancouver",level:"craft",details:"Olympic Village craft brewpub with big projector screens, arcade games, and a huge selection of in-house beers.",length:0,Venue_time:120,lat:49.2694506,lng:-123.10351750000001,last_updated:s()}),o(t,{code:"VAN05",photo_url:"https://biminis1975.ca/wp-content/uploads/2025/02/DSC00118-1.jpg",name:"Bimini's Since 1975",city:"Vancouver",level:"casual",details:"Legendary Kitsilano neighbourhood pub since 1975 with big-screen TVs, daily specials, and retro vibes.",length:0,Venue_time:90,lat:49.2678833,lng:-123.1508689,last_updated:s()}),o(t,{code:"VAN06",photo_url:"https://static.wixstatic.com/media/914129_99ab0f978e0a434ea0185bdc3a9f77f5~mv2.jpg/v1/fill/w_2500,h_1666,al_c/914129_99ab0f978e0a434ea0185bdc3a9f77f5~mv2.jpg",name:"The Park Pub",city:"Vancouver",level:"lively",details:"West End sports pub with 17 HD screens, all major broadcaster subscriptions, and early 7am weekend opening for international matches.",length:0,Venue_time:120,lat:49.2870025,lng:-123.14102929999999,last_updated:s()}),o(t,{code:"VAN07",photo_url:"https://cdn.prod.website-files.com/62954f7e3328512ebad888a4/63d334087e4bf41fa27ae276_courtside-img.png",name:"Courtside Food & Drinks",city:"Vancouver",level:"upscale",details:"Trendy Mount Pleasant sports bar with immersive basketball decor, a 15-ft outdoor jumbotron, and elevated stadium eats.",length:0,Venue_time:90,lat:49.2633873,lng:-123.1012726,last_updated:s()}),o(t,{code:"VAN08",photo_url:"https://static.wixstatic.com/media/2cf2fd_9bc26420efb04e1894be04479321c8c7.jpg/v1/fit/w_2500,h_1330,al_c/2cf2fd_9bc26420efb04e1894be04479321c8c7.jpg",name:"Red Card Sports Bar + Eatery",city:"Vancouver",level:"casual",details:"Charming 1908 building in downtown Vancouver with 16 HD TVs, two projector screens, and an Italian wood-burning pizza oven.",length:0,Venue_time:90,lat:49.2794251,lng:-123.12034709999999,last_updated:s()}),o(t,{code:"RMD01",photo_url:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/ed/4d/ce/our-house-is-your-house.jpg?w=900&h=500&s=1",name:"The Canadian Brewhouse & Grill",city:"Richmond",level:"family-friendly",details:"Richmond's go-to sports bar with wall-to-wall TVs, a massive menu, and a welcoming atmosphere for all ages.",length:0,Venue_time:90,lat:49.17762,lng:-123.12370999999999,last_updated:s()}),o(t,{code:"SUR01",photo_url:"https://images-dh-production-baselayer.dailyhive.com/uploads/2024/05/image-33-2-e1716413850919.jpg?format=auto&width=988",name:"Par4 Kitchen & Bar",city:"Surrey",level:"upscale",details:"Surrey's premier sports lounge with golf simulators, elevated global comfort cuisine, and UFC on every screen.",length:0,Venue_time:120,lat:49.1038281,lng:-122.8005669,last_updated:s()})}async function f(){const t=d(i,"venue");(await u(t)).empty?(console.log("Venues collection is empty. Seeding data..."),v()):console.log("Venues collection already contains data. Skipping seed.")}f();async function w(){let t=document.getElementById("venueCardTemplate");const l=d(i,"venue");try{(await u(l)).forEach(c=>{let a=t.content.cloneNode(!0);const e=c.data();a.querySelector(".card-title").textContent=e.name,a.querySelector(".card-text").textContent=e.details||`Located in ${e.city}.`,a.querySelector(".card-level").textContent=e.level;const r=e.images?.[0]??"path/to/placeholder.jpg";e.images?.length&&r?a.querySelector(".card-image").src=r:(a.querySelector(".card-image").textContent=e.photo_url,a.querySelector("img").setAttribute("src",`${e.photo_url}`)),a.querySelector(".read-more").href=`./pages/venue.html?docID=${c.id}`,a.getElementById("card-overlay").classList.add("text-2xl"),a.getElementById("card-overlay").classList.add("p-2"),document.getElementById("venue-card-carousel").appendChild(a)})}catch(n){console.error("Error getting documents: ",n)}}w();async function b(){$("#stacked-cards").empty();try{const n=(await(await fetch("https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=4429&s=2026")).json()).events||[],c=new Date;n.filter(e=>new Date(e.strTimestamp)).slice(0,6).forEach(e=>{const r=new Date(e.strTimestamp),p=`
          <div class="flex flex-col bg-white rounded-xl shadow hover:bg-orange-500 hover:text-white transition max-w-4xl mx-auto mb-[1%] py-[2%]">

            <!-- HEADER -->
            <div class="match-card flex justify-between items-center cursor-pointer p-4">

              <div class="flex flex-col items-center">
                <img src="${e.strHomeTeamBadge||"https://via.placeholder.com/80"}"
                     class="w-16 h-16 object-cover">
                <p class="text-sm">${e.strHomeTeam}</p>
              </div>

              <div class="text-center">
                <h3 class="font-bold">
                  ${r.toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}
                </h3>
                <p class="text-sm">
                  ${r.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                </p>
                <p class="text-xs opacity-70">${e.strLeague}</p>
              </div>

              <div class="flex flex-col items-center">
                <img src="${e.strAwayTeamBadge||"https://via.placeholder.com/80"}"
                     class="w-16 h-16 object-cover">
                <p class="text-sm">${e.strAwayTeam}</p>
              </div>

            </div>

            <!-- DROPDOWN -->
            <div class="match-details hidden p-4 bg-white text-black space-y-1">

              <p><strong>Match:</strong> ${e.strEvent}</p>
              <p><strong>Round:</strong> ${e.intRound||"N/A"}</p>
              <p><strong>Status:</strong> ${e.strStatus||"Scheduled"}</p>

              <p><strong>Score:</strong> 
                ${e.intHomeScore??"-"} : ${e.intAwayScore??"-"}
              </p>

              <p><strong>Venue:</strong> ${e.strVenue||"Unknown"}</p>
              <p><strong>Location:</strong> ${e.strCity||""}, ${e.strCountry||""}</p>

              <p><strong>Season:</strong> ${e.strSeason}</p>
            </div>  
          </div>
          `;$("#stacked-cards").append(p)})}catch(t){console.error("Error fetching matches:",t)}}$(document).on("click",".match-card",function(){const t=$(this).next(".match-details");$(".match-details").not(t).slideUp(200),t.slideToggle(200)});$(document).ready(function(){b()});
