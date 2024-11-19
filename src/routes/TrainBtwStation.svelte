<script lang="ts">
import { DurationSecToHM, trainRunningDate, trainRunsOnUtil } from "$lib";
import { Separator } from "$lib/components/ui/separator";
import type { StationGeneralInfo } from "api-railway/dist/stations";
import type { TrainsBetweenStationsTrains } from "api-railway/dist/trainsBtwStations";
import ScheduleDialog from "./ScheduleDialog.svelte";

type Props = {
  train: TrainsBetweenStationsTrains;
  fromStation?: StationGeneralInfo;
  toStation?: StationGeneralInfo;
};

const { train, fromStation, toStation }: Props = $props();
</script>

<section class="border-solid border-2 rounded-xl">
  <div
    class="p-2 flex justify-between rounded-t-xl font-bold bg-muted text-muted-forground items-center"
  >
    <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
      {train.trainName} ({train.trainNumber})
    </div>
    <ScheduleDialog trainNumber={train.trainNumber} />
  </div>
  <section class="p-2 grid grid-cols-3">
    <div class="font-bold">
      {train.stationFrom.departureTime?.slice(0, 5)}
    </div>
    <div class="flex justify-center items-center text-nowrap">
      <Separator class="w-8 mr-2" />
      {DurationSecToHM(train.durationSec)}
      <Separator class="w-8 ml-2" />
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
