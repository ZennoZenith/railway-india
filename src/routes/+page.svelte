<script lang="ts">
import { catchError, Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import SwapVertical from "$lib/components/swap-vertical-svgrepo-com.svelte";
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import { CalendarDate, type DateValue } from "@internationalized/date";
import type { StationGeneralInfo } from "api-railway/dist/stations";
import type { TrainsBetweenStations } from "api-railway/dist/trainsBtwStations";
import { untrack } from "svelte";
import {
  validateSchema,
  type ValidationError,
} from "./api/trainsBtwStations/search/schema";
import DatePicker from "./DatePicker.svelte";
import TrainBtwStation from "./TrainBtwStation.svelte";

const todayDate = new Date();
const debounce = new Debounce();
const toastState = getToastState();
const fromStationSearchable = new CreateSearchable(100);
const toStationSearchable = new CreateSearchable(100);

let fromStationInputRef = $state<HTMLElement | null>(null);
let toStationInputRef = $state<HTMLElement | null>(null);
let fromStationInputValue: string = $state("");
let toStationInputValue: string = $state("");
let date = $state<DateValue>(
  new CalendarDate(
    todayDate.getFullYear(),
    todayDate.getMonth() + 1,
    todayDate.getDate(),
  ),
);
let formatedDate = $derived(date?.toString());
let list = $state<DropDownListItem[]>([]);
let fromStationSelected = $state<DropDownListItem>();
let toStationSelected = $state<DropDownListItem>();

let response = $state<Superposition<ValidationError, TrainsBetweenStations>>();

let trainsOnDate = $derived.by(() => {
  if (response?.success) {
    return response.data.trainsOnDate;
  }
});

let trainsOnAlternateDate = $derived.by(() => {
  if (response?.success) {
    return response.data.trainsOnAlternateDate;
  }
});

let stationIdMap = $derived.by(() => {
  const m = new Map<number, StationGeneralInfo>();
  if (response?.success) {
    response.data.stations.forEach(v => m.set(v.id, v));
  }
  return m;
});

let validationErrors = $derived.by(() => {
  if (response?.success === false && response.error.type === "VALIDATION") {
    return response.error.data;
  }
});

$effect(() => {
  response;
  untrack(() => {
    if (!response) {
      return;
    }

    if (response.success) {
      if (
        response.data.trainsOnAlternateDate.length === 0
        && response.data.trainsOnAlternateDate.length === 0
      ) {
        toastState.info(
          `No trains found between ${fromStationSelected?.dataText} and ${toStationSelected?.dataText}`,
        );
      }
      console.log();
      return;
    }

    if (response.error.type === "VALIDATION") {
      return;
    }

    toastState.error(response.error.messages[0]);
  });
});

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  if (event.currentTarget.value.trim().length === 0) {
    return;
  }
  debounce.debounceAsync(autocomplete)(event.currentTarget.value);
}

async function autocomplete(query: string) {
  const res = await catchError(fetch("/api/stations/search", {
    method: "POST",
    body: JSON.stringify({ q: query }),
    headers: {
      "content-type": "application/json",
    },
  }));

  if (res[0]) {
    console.error(res[0]);
    return;
  }

  let data = await catchError<DropDownListItem[]>(res[1].json());
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
  const formEntries = Object.fromEntries(formData.entries());

  let parsed = validateSchema(formEntries);

  if (!parsed.success) {
    response = parsed;
    return;
  }

  const errorJson = await fetchJson<Superposition<{}, TrainsBetweenStations>>(
    "/api/trainsBtwStations/search",
    {
      method: "POST",
      body: JSON.stringify(parsed.data),
    },
  );

  if (!errorJson.success) {
    console.error(errorJson.error);
    return;
  }
  response = errorJson.data;
}
</script>

<form
  class="grid grid-cols-1 md:grid-cols-4 gap-2"
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
    {#if validationErrors?.fromStation && validationErrors.fromStation[0]}
      <p class="text-sm text-error">Invalid station</p>
    {/if}
    <button
      class="absolute right-3 -bottom-4 w-6 flex z-[5] justify-center items-center md:-right-4 md:bottom-0 md:top-0 md:rotate-90"
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
    {#if validationErrors?.toStation && validationErrors.toStation[0]}
      <p class="text-sm text-error">Invalid station</p>
    {/if}
    <Dropdown
      searchable={toStationSearchable}
      bind:selectedItem={toStationSelected}
      onSelect={onToStationSelect}
      {list}
    />
  </div>
  <input type="hidden" name="flexible" value="true" />
  <div class="relative">
    <DatePicker bind:value={date} />
    {#if validationErrors?.date && validationErrors.date[0]}
      <p class="text-sm text-error">Invalid date</p>
    {/if}
  </div>
  <input
    type="hidden"
    name="date"
    value={formatedDate}
  >
  <Button type="submit">Search</Button>
</form>

<section>
  <!--  n Results for [from station] -> [to station] | [date] for quota [quota] -->
</section>

{#if trainsOnDate}
  <section class="mt-8 flex flex-col gap-2">
    {#each trainsOnDate as train (train.trainId)}
      <TrainBtwStation
        {train}
        fromStation={stationIdMap.get(train.stationFrom.stationId)}
        toStation={stationIdMap.get(train.stationTo.stationId)}
      />
    {/each}
  </section>
{/if}

<!-- ------------------------  -->
{#if trainsOnAlternateDate && trainsOnAlternateDate.length > 0}
  <div class="mt-8 py-4 px-4 bg-info text-info-foreground rounded-md">
    Train on alternate days
  </div>
  <section class="mt-8 flex flex-col gap-2">
    {#each trainsOnAlternateDate as train (train.trainId)}
      <TrainBtwStation
        {train}
        fromStation={stationIdMap.get(train.stationFrom.stationId)}
        toStation={stationIdMap.get(train.stationTo.stationId)}
      />
    {/each}
  </section>
{/if}
