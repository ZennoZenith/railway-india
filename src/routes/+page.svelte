<script lang="ts">
import { enhance } from "$app/forms";
import {
  catchError,
  Debounce,
  DurationSecToHM,
  trainRunningDate,
  trainRunsOnUtil,
} from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import LocationPin from "$lib/components/location-pin.svelte";
import { Input } from "$lib/components/ui/input";
import { CreateSearchable } from "$lib/search.svelte";
import type { DropDownListItem } from "$lib/types";
import type { TrainsBetweenStations } from "api-railway/dist/trainsBtwStations";

let formRef: HTMLFormElement;
const fromStationSearchable = new CreateSearchable(100);
const toStationSearchable = new CreateSearchable(100);
let fromStationInputValue: string = $state("");
let toStationInputValue: string = $state("");
const debounce = new Debounce();
let list = $state<DropDownListItem[]>([]);
let fromStationSelected = $state<DropDownListItem>();
let toStationSelected = $state<DropDownListItem>();

let trainsData: TrainsBetweenStations[] = [
  {
    "trainId": 76,
    "trainNumber": "04044",
    "trainName": "NZM ABKP SPECIAL",
    "trainFullName": "Hazrat Nizamuddin - Ambikapur AC SF Special Fare Special",
    "trainRunningDays": {
      "sunday": false,
      "monday": false,
      "tueday": true,
      "wednesday": false,
      "thursday": false,
      "friday": false,
      "saturday": false,
    },
    "availableClasses": [
      "1A",
      "2A",
      "3A",
      "GN",
    ],
    "hasPantry": true,
    "trainTypeCode": "SF",
    "returnTrainNumber": "04043",
    "distance": 305.9,
    "durationSec": 69900,
    "stationFrom": {
      "srNo": "1",
      "stationId": 745,
      "stationCode": "NZM",
      "stationName": "Hazrat Nizamuddin",
      "stationType": "regular",
      "arrivalTime": "23:00:00",
      "departureTime": "23:00:00",
      "haltTimeSec": 0,
      "platform": "",
      "dayCount": 1,
      "distance": 0,
      "speed": 0,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z",
    },
    "stationTo": {
      "srNo": "4",
      "stationId": 737,
      "stationCode": "GWL",
      "stationName": "Gwalior Junction",
      "stationType": "junction",
      "arrivalTime": "03:35:00",
      "departureTime": "03:37:00",
      "haltTimeSec": 120,
      "platform": "",
      "dayCount": 2,
      "distance": 305.9,
      "speed": 70.9,
      "boardingDisabled": false,
      "updatedAt": "2024-08-04T12:06:52.807Z",
    },
    "updatedAt": "2024-08-04T12:06:52.807Z",
  },
];

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  if (event.currentTarget.value.trim().length === 0) {
    return;
  }
  debounce.debounceAsync(autocomplete)(event.currentTarget.value);
}

async function autocomplete(query: string) {
  const response = await catchError(fetch("/api/stations/search", {
    method: "POST",
    body: JSON.stringify({ q: query }),
    headers: {
      "content-type": "application/json",
    },
  }));

  if (response[0]) {
    console.error(response[0]);
    return;
  }

  let data = await catchError<DropDownListItem[]>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    return;
  }

  list = data[1];
}

function onFromStationSelect() {
  fromStationInputValue = fromStationSelected?.text ?? "";
}
function onToStationSelect() {
  toStationInputValue = toStationSelected?.text ?? "";
}
</script>

<form
  bind:this={formRef}
  class="flex content-between"
  action="/"
  method="POST"
  use:enhance
>
  <div
    class="relative"
    onfocusout={fromStationSearchable.onFocusLoss}
  >
    <Input
      type="text"
      placeholder="From station"
      bind:value={fromStationInputValue}
      autocomplete="off"
      onfocus={fromStationSearchable.onFocus}
      onkeyup={onInputChange}
    />
    <input
      type="hidden"
      name="fromStation"
      value={fromStationSelected?.dataText ?? ""}
    >
    <Dropdown
      searchable={fromStationSearchable}
      bind:selectedItem={fromStationSelected}
      onSelect={onFromStationSelect}
      {list}
    />
  </div>
  <div
    class="relative"
    onfocusout={toStationSearchable.onFocusLoss}
  >
    <Input
      type="text"
      placeholder="To station"
      bind:value={toStationInputValue}
      autocomplete="off"
      onfocus={toStationSearchable.onFocus}
      onkeyup={onInputChange}
    />
    <input
      type="hidden"
      name="toStation"
      value={toStationSelected?.dataText ?? ""}
    >
    <Dropdown
      searchable={toStationSearchable}
      bind:selectedItem={toStationSelected}
      onSelect={onToStationSelect}
      {list}
    />
  </div>
</form>

<section>
  <!--  n Results for [from station] -> [to station] | [date] for quota [quota] -->
</section>

{#each trainsData as train (train.trainId)}
  <section class="m-2 border-solid border-2 rounded-xl">
    <div
      class="p-2 flex justify-between rounded-t-xl font-bold bg-muted text-muted-forground"
    >
      <div class="whitespace-nowrap">
        {train.trainName} ({train.trainNumber})
      </div>
      <a class="flex gap-2" href="/schedules/{train.trainNumber}">
        Train Schedule
        <span class="w-6">
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
        <div class="whitespace-nowrap">
          {train.stationFrom.stationName}
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
      <div class="flex flex-col items-end">
        <div class="whitespace-nowrap">{train.stationTo.stationName}</div>
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
{/each}

<style>
</style>
