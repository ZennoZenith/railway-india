<script lang="ts">
import { DurationSecToHM, trainRunningDate, trainRunsOnUtil } from "$lib";
import LocationPin from "$lib/components/location-pin.svelte";
import type { StationGeneralInfo } from "api-railway/dist/stations";
import type { TrainsBetweenStationsTrains } from "api-railway/dist/trainsBtwStations";

type Props = {
  train: TrainsBetweenStationsTrains;
  fromStation?: StationGeneralInfo;
  toStation?: StationGeneralInfo;
};

const { train, fromStation, toStation }: Props = $props();
</script>

<section class="border-solid border-2 rounded-xl">
  <div
    class="p-2 flex justify-between rounded-t-xl font-bold bg-muted text-muted-forground"
  >
    <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
      {train.trainName} ({train.trainNumber})
    </div>
    <a
      class="flex gap-2 whitespace-nowrap"
      href="/schedules/{train.trainNumber}"
    >
      Train Schedule
      <span class="w-6 whitespace-nowrap">
        <LocationPin />
      </span>
    </a>
  </div>
  <section class="p-2 grid grid-cols-3">
    <div class="font-bold">
      {train.stationFrom.departureTime?.slice(0, 5)}
    </div>
    <div class="flex justify-center">
      {DurationSecToHM(train.durationSec)}
    </div>
    <div class="flex justify-end font-bold">
      {train.stationTo.arrivalTime?.slice(0, 5)}
    </div>
  </section>

  <section class="p-2 grid grid-cols-3">
    <div class="">
      <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
        {fromStation?.stationName || "UNKNOWN"}
      </div>
      <div class="">{trainRunningDate(train.stationFrom.dayCount)}</div>
    </div>
    <div class="flex justify-center items-center gap-2">
      {#each trainRunsOnUtil(train.trainRunningDays) as day}
        {#if day.state}
          <span class="text-foreground">
            {day.text}
          </span>
        {:else}
          <span class="text-muted">
            {day.text}
          </span>
        {/if}
      {/each}
    </div>
    <div class="flex flex-col text-right">
      <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
        {toStation?.stationName || "UNKNOWN"}
      </div>
      <div class="">
        {trainRunningDate(train.stationTo.dayCount)}
      </div>
    </div>
  </section>
  <div class="p-2 flex gap-2">
    Classes:
    {#each train.availableClasses as classes}
      <span class="">
        {classes}
      </span>
    {/each}
  </div>
</section>
