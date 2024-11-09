<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<section
  id="schedule"
  class="grid border-2 border-solid border-primary overflow-x-auto"
>
  <div class="border-r-2 border-b-2 border-solid border-primary">Sr No.</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">Station</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">
    Arrival Time
  </div>
  <div class="border-r-2 border-b-2 border-solid border-primary">
    Departure Time
  </div>
  <div class="border-r-2 border-b-2 border-solid border-primary">Halt Time</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">Speed</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">Platform</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">Day</div>
  <div class="border-r-2 border-b-2 border-solid border-primary">
    Distance (km)
  </div>
  <div class="border-b-2 border-solid border-primary">Avg. Speed (km/h)</div>
  {#each data.schedule as row}
    <div class="border-r-2 border-solid border-primary">{row.srNo}</div>
    <div class="border-r-2 border-solid border-primary">
      {row.station.stationCode}
    </div>
    <div class="border-r-2 border-solid border-primary">
      {row.arrivalTime?.slice(0, 5)}
    </div>
    <div class="border-r-2 border-solid border-primary">
      {row.departureTime?.slice(0, 5)}
    </div>
    <div class="border-r-2 border-solid border-primary">
      {row.haltTime?.slice(0, 5)}
    </div>
    <div class="border-r-2 border-solid border-primary">{row.speed}</div>
    <div class="border-r-2 border-solid border-primary">{row.platform}</div>
    <div class="border-r-2 border-solid border-primary">{row.dayCount}</div>
    <div class="border-r-2 border-solid border-primary">{row.distance}</div>
    <div>{row.speed}</div>
  {/each}
</section>

<style>
#schedule {
  grid-template-columns: repeat(10, minmax(6em, 1fr));
}
#schedule > div {
  display: flex;
  justify-content: center;
}
</style>
