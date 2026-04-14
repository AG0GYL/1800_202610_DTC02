async function addStackedCards() {
  $("#stacked-cards").empty();

  try {
    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=4429&s=2026",
    );

    const data = await response.json();
    const matches = data.events || [];

    const now = new Date();

    const upcomingMatches = matches
      .filter((match) => new Date(match.strTimestamp))
      .slice(0, 6);

    upcomingMatches.forEach((match) => {
      const date = new Date(match.strTimestamp);

      const stackedCards = `
          <div class="flex w-full flex-col bg-white rounded-xl shadow hover:bg-orange-500 hover:text-white transition max-w-4xl mx-auto mb-[1%] py-[2%]">

            <!-- HEADER -->
            <div class="match-card flex justify-between items-center cursor-pointer p-4">

              <div class="flex flex-col items-center w-1/3">
                <img src="${match.strHomeTeamBadge || "https://via.placeholder.com/80"}"
                     class="w-16 h-16 object-cover">
                <p class="text-sm text-center">${match.strHomeTeam}</p>
              </div>

              <div class="text-center w-1/3">
                <h3 class="font-bold">
                  ${date.toLocaleDateString("en-CA", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <p class="text-sm text-center">
                  ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p class="text-xs opacity-70">${match.strLeague}</p>
              </div>

              <div class="flex flex-col items-center w-1/3">
                <img src="${match.strAwayTeamBadge || "https://via.placeholder.com/80"}"
                     class="w-16 h-16 object-cover">
                <p class="text-sm text-center">${match.strAwayTeam}</p>
              </div>

            </div>

            <!-- DROPDOWN -->
            <div class="match-details hidden p-4 bg-white text-black space-y-1">

              <p><strong>Match:</strong> ${match.strEvent}</p>
              <p><strong>Round:</strong> ${match.intRound || "N/A"}</p>
              <p><strong>Status:</strong> ${match.strStatus || "Scheduled"}</p>

              <p><strong>Score:</strong> 
                ${match.intHomeScore ?? "-"} : ${match.intAwayScore ?? "-"}
              </p>

              <p><strong>Venue:</strong> ${match.strVenue || "Unknown"}</p>
              <p><strong>Location:</strong> ${match.strCity || ""}, ${match.strCountry || ""}</p>

              <p><strong>Season:</strong> ${match.strSeason}</p>
            </div>  
          </div>
          `;

      $("#stacked-cards").append(stackedCards);
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
}

// Toggle dropdown
$(document).on("click", ".match-card", function () {
  const details = $(this).next(".match-details");

  $(".match-details").not(details).slideUp(200);

  details.slideToggle(200);
});

$(document).ready(function () {
  addStackedCards();
});
