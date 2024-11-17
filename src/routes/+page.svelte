<script lang="ts">
import {
  catchError,
  Debounce,
  DurationSecToHM,
  trainRunningDate,
  trainRunsOnUtil,
} from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import LocationPin from "$lib/components/location-pin.svelte";
import SwapVertical from "$lib/components/swap-vertical-svgrepo-com.svelte";
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import type { StationGeneralInfo } from "api-railway/dist/stations";
import { untrack } from "svelte";
import type { Return } from "./api/trainsBtwStations/search/+server";
import { validateSchema } from "./api/trainsBtwStations/search/schema";

let fromStationInputRef = $state<HTMLElement | null>(null);
let toStationInputRef = $state<HTMLElement | null>(null);
const fromStationSearchable = new CreateSearchable(100);
const toStationSearchable = new CreateSearchable(100);
let fromStationInputValue: string = $state("");
let toStationInputValue: string = $state("");
const debounce = new Debounce();
let list = $state<DropDownListItem[]>([]);
let fromStationSelected = $state<DropDownListItem>();
let toStationSelected = $state<DropDownListItem>();
const toastState = getToastState();

let apiData = $state<Return>();

const stationIdMap = new Map<number, StationGeneralInfo>();
let trainsData = $derived.by(() => {
  if (!apiData) {
    return;
  }

  untrack(() => {
    if (apiData && !apiData.success && apiData.error.type === "API") {
      toastState.error(apiData.error.message);
    }
    if (apiData && !apiData.success && apiData.error.type === "VALIDATION") {
      if (apiData.error.allTrains) {
        toastState.error(apiData.error.allTrains[0]);
      }
      if (apiData.error.date) {
        toastState.error(apiData.error.date[0]);
      }
      if (apiData.error.flexible) {
        toastState.error(apiData.error.flexible[0]);
      }
      if (apiData.error.fromStation) {
        toastState.error(apiData.error.fromStation[0]);
      }
      if (apiData.error.toStation) {
        toastState.error(apiData.error.toStation[0]);
      }
    }
  });

  if (apiData.success) {
    stationIdMap.clear();
    apiData.data.stations.forEach(v => stationIdMap.set(v.id, v));
    return apiData.data;
  }
  return undefined;
});

$inspect(apiData);

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
  fromStationInputRef?.focus();
}

function onToStationSelect() {
  toStationInputValue = toStationSelected?.text ?? "";
  toStationInputRef?.focus();
}

function swapStations() {
  const t1 = fromStationInputValue;
  fromStationInputValue = toStationInputValue;
  toStationInputValue = t1;

  const t2 = fromStationSelected;
  fromStationSelected = toStationSelected;
  toStationSelected = t2;
}

async function onFormSubmit(
  event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  const d = Object.fromEntries(formData.entries());

  let parsed = validateSchema(d);

  if (parsed[0]) {
    apiData = {
      success: false,
      error: {
        httpCode: 400,
        type: "VALIDATION",
        ...parsed[0],
      },
    };
    return;
  }

  const res = await catchError(fetch("/api/trainsBtwStations/search", {
    method: "POST",
    body: JSON.stringify(parsed[1]),
  }));

  if (res[0]) {
    apiData = {
      success: false,
      error: {
        httpCode: 400,
        type: "API",
        message: res[0].message,
      },
    };
    return;
  }

  let f = await catchError<Return>(res[1].json());
  if (f[0]) {
    apiData = {
      success: false,
      error: {
        httpCode: 400,
        type: "API",
        message: f[0].message,
      },
    };
    return;
  }

  apiData = f[1];
}
</script>

<form
  class="grid grid-cols-1 gap-2"
  onsubmit={onFormSubmit}
>
  <div
    class="relative"
    onfocusout={fromStationSearchable.onFocusLoss}
  >
    <Input
      bind:ref={fromStationInputRef}
      type="text"
      placeholder="From station"
      bind:value={fromStationInputValue}
      autocomplete="off"
      required
      minlength={0}
      onfocus={fromStationSearchable.onFocus}
      oninput={onInputChange}
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
    <button
      class="absolute right-3 top-7 w-6 flex z-[5] justify-center items-center"
      type="button"
      onclick={swapStations}
    >
      <SwapVertical />
    </button>
  </div>
  <div
    class="relative"
    onfocusout={toStationSearchable.onFocusLoss}
  >
    <Input
      bind:ref={toStationInputRef}
      type="text"
      placeholder="To station"
      bind:value={toStationInputValue}
      autocomplete="off"
      required
      minlength={0}
      onfocus={toStationSearchable.onFocus}
      oninput={onInputChange}
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

  <Button type="submit">Search</Button>
</form>

<section>
  <!--  n Results for [from station] -> [to station] | [date] for quota [quota] -->
</section>

{#if trainsData}
  <section class="mt-8 flex flex-col gap-2">
    {#each trainsData.trainsOnDate as train (train.trainId)}
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
              {stationIdMap.get(train.stationFrom.stationId)?.stationName}
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
              {stationIdMap.get(train.stationTo.stationId)?.stationName}
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
    {/each}
  </section>

  <!-- ------------------------  -->
  <section class="mt-8">
    Train on alternate days
  </section>

  <section class="mt-8 flex flex-col gap-2">
    {#each trainsData.trainsOnAlternateDate as train (train.trainId)}
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
              {stationIdMap.get(train.stationFrom.stationId)?.stationName}
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
              {stationIdMap.get(train.stationTo.stationId)?.stationName}
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
    {/each}
  </section>
{/if}

<style>
</style>
