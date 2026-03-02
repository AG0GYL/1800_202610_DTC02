function addVenueCarousel() {
  for (let i = 0; i < 5; i++) {
    const venueCarousel = `
    <article
      class="overflow-hidden flex rounded-lg relative flex-col gap-2 shrink-0 shadow-2xl border-2 border-stone-600 hover:border-orange-600"
    >
      <img src="https://picsum.photos/id/${237 + i}/300/150" class="w-full" alt="" />
      <!-- TEXT -->
      <div class="absolute top-1 left-1">
        <ul
          class="flex gap-2 py-1 px-3 text-sm items-center text-white font-semibold rounded-full bg-orange-600"
        >
          <li>Football</li>
          <!-- DIVIDER -->
          <div class="w-[1px] h-2/3 bg-gray-400 my-2"></div>
          <li>$$$</li>
        </ul>
      </div>
      <div class="p-2 flex flex-col gap-1">
        <h3 class="text-xl font-extrabold">Venue</h3>
        <p class="text-sm">Lorem 123 Street #123 V12 A12</p>
      </div>
    </article>
    `;
    $("#card-carousel").append(venueCarousel);
  }
}

$(document).ready(function () {
  addVenueCarousel();
});
