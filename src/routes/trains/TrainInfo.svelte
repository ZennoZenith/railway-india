<script lang="ts">
import { DurationSecToHM, trainRunsOnUtil } from "$lib";
import type { TrainInfo } from "api-railway/dist/types";

const { trainInfo }: { trainInfo: TrainInfo } = $props();
</script>

<section class="grid grid-cols-2 mx-auto w-max">
  <div>Train Number</div>
  <div>{trainInfo.trainNumber}</div>
  <div>Train Name</div>
  <div>{trainInfo.trainName}</div>
  <div>Train Full Name</div>
  <div>{trainInfo.trainFullName}</div>
  <div>Train Runs On</div>
  <div class="flex gap-2">
    {#each trainRunsOnUtil(trainInfo.trainRunningDays) as day}
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
  <div>{trainInfo.availableClasses.join(", ")}</div>
  <div>Pantry</div>
  <div>{trainInfo.hasPantry ? "Yes" : "No"}</div>
  <div>Train Type</div>
  <div>{trainInfo.trainTypeCode}</div>
  <div>Station From</div>
  <a href={`/stations/${trainInfo.stationFrom.stationCode}`}>
    {trainInfo.stationFrom.stationName} ({trainInfo.stationFrom.stationCode})</a
  >
  <div>Departure Time</div>
  <div>{trainInfo.departureTime}</div>
  <div>Station To</div>
  <a href={`/stations/${trainInfo.stationTo.stationCode}`}>
    {trainInfo.stationTo.stationName} ({trainInfo.stationTo.stationCode})</a>
  <div>Departure Time</div>
  <div>{trainInfo.arrivalTime}</div>
  <div>Duration</div>
  <div>{DurationSecToHM(trainInfo.durationSec)}</div>
  <div>Distance</div>
  <div>{trainInfo.distance} km</div>
  <div>Avrage Speed</div>
  <div>{trainInfo.avgSpeed} km/h</div>
  <div>Number of stops</div>
  <div>{trainInfo.numberOfStops}</div>
  <div>Return Train number</div>
  <div>{trainInfo.returnTrainNumber}</div>
</section>
