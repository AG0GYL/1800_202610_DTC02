function addStackedCards() {
  for (let i = 0; i < 6; i++) {
    const stackedCards = `
    <div class="flex flex-col">
            <div class="flex flex-row justify-between hover:bg-orange-600 border-b hover:rounded-xl p-[5%] hover:text-white hover:border-collapse">
              <div class="flex flex-col">
                <img src="https://picsum.photos/id/${310 + i}/300/150" alt="placeholder" class="rounded-full w-20 h-20 border-3">
                <p class="text-sm text-center">Team A</p>
              </div>
              <div class="flex flex-col text-center space-y-[2%]">
                <h3 class="text-xl font-extrabold">Day, Month Date, Year</h3>
                <p class="text-sm">Time, Timezone</p>
                <p class="text-sm opacity-50">Match, Group </p>
              </div>
              <div class="flex flex-col">
                <img src="https://picsum.photos/id/${400 + i}/300/150" alt="placeholder" class="rounded-full w-20 h-20 border-3">
                <p class="text-sm text-center">Team B</p>
              </div>
            </div>
          </div>
          `;
    $("#stacked-cards").append(stackedCards);
  }
}

$(document).ready(function () {
  addStackedCards();
});
