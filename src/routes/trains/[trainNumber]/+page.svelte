<script lang="ts">
import { DurationSecToHM, trainRunsOnUtil } from "$lib";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<section class="grid grid-cols-2 mx-auto w-max">
  <div>Train Number</div>
  <div>{data.trainNumber}</div>
  <div>Train Name</div>
  <div>{data.trainName}</div>
  <div>Train Full Name</div>
  <div>{data.trainFullName}</div>
  <div>Train Runs On</div>
  <div class="flex gap-2">
    {#each trainRunsOnUtil(data.trainRunningDays) as day}
      {#if day.state}
        <span class="text-green-400">
          {day.text}
        </span>
      {:else}
        <span class="text-red-400">
          {day.text}
        </span>
      {/if}
    {/each}
  </div>

  <div>Available Classes</div>
  <div>{data.availableClasses.join(", ")}</div>
  <div>Pantry</div>
  <div>{data.hasPantry ? "Yes" : "No"}</div>
  <div>Train Type</div>
  <div>{data.trainTypeCode}</div>
  <div>Station From</div>
  <a href={`/stations/${data.stationFrom.stationCode}`}>
    {data.stationFrom.stationName} ({data.stationFrom.stationCode})</a>
  <div>Departure Time</div>
  <div>{data.departureTime}</div>
  <div>Station To</div>
  <a href={`/stations/${data.stationTo.stationCode}`}>
    {data.stationTo.stationName} ({data.stationTo.stationCode})</a>
  <div>Departure Time</div>
  <div>{data.arrivalTime}</div>
  <div>Duration</div>
  <div>{DurationSecToHM(data.durationSec)}</div>
  <div>Distance</div>
  <div>{data.distance} km</div>
  <div>Avrage Speed</div>
  <div>{data.avgSpeed} km/h</div>
  <div>Number of stops</div>
  <div>{data.numberOfStops}</div>
  <div>Return Train number</div>
  <div>{data.returnTrainNumber}</div>
</section>
