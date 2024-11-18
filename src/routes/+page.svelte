<script lang="ts">
import { Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import SwapVertical from "$lib/components/swap-vertical-svgrepo-com.svelte";
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
} from "@internationalized/date";
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
const stationIdMap = new Map<number, StationGeneralInfo>();
const df = new DateFormatter("en-US", { dateStyle: "full" });

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
let lastSelectedFromStation = $state<StationGeneralInfo>();
let lastSelectedToStation = $state<StationGeneralInfo>();
let lastSelectedDate = $state<string>("2002-03-19");

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

  if (event.currentTarget.id === "from-station") {
    fromStationSelected = undefined;
  } else if (event.currentTarget.id === "to-station") {
    toStationSelected = undefined;
  }

  resetError(event.currentTarget.id);
  debounce.debounceAsync(autocomplete)(event.currentTarget.value);
}

function resetError(id?: string) {
  if (!response) {
    return;
  }

  if (response.success) {
    return;
  }

  if (response.error.type !== "VALIDATION") {
    return;
  }

  if (id === "from-station") {
    response.error.data.fromStation = undefined;
  } else if (id === "to-station") {
    response.error.data.toStation = undefined;
  } else {
    response.error.data = {};
  }
}

async function autocomplete(query: string) {
  const errorJson = await fetchJson<Superposition<{}, StationGeneralInfo[]>>(
    "/api/stations/search",
    {
      method: "POST",
      body: JSON.stringify({ q: query }),
      headers: {
        "content-type": "application/json",
      },
    },
  );

  if (!errorJson.success) {
    console.error(errorJson.error);
    return;
  }
  const response = errorJson.data;

  if (!response.success) {
    list = [];
    return;
  }

  list = response.data.map(v => {
    return {
      dataText: v.stationCode,
      text: `(${v.stationCode}) ${v.stationName}`,
      key: v.id.toString(),
    } as DropDownListItem;
  });
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
      headers: {
        "content-type": "application/json",
      },
    },
  );

  if (!errorJson.success) {
    console.error(errorJson.error);
    return;
  }

  if (errorJson.data.success) {
    stationIdMap.clear();
    errorJson.data.data.stations.forEach(v => stationIdMap.set(v.id, v));

    if (fromStationSelected) {
      lastSelectedFromStation = stationIdMap.get(
        parseInt(fromStationSelected.key),
      );
    }
    if (toStationSelected) {
      lastSelectedToStation = stationIdMap.get(
        parseInt(toStationSelected.key),
      );
    }
    lastSelectedDate = formatedDate;
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
      id="from-station"
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
    {#if validationErrors?.fromStation}
      {#each validationErrors.fromStation as err}
        <p class="text-sm text-error">{err}</p>
      {/each}
    {/if}
    <Dropdown
      searchable={fromStationSearchable}
      bind:selectedItem={fromStationSelected}
      onSelect={onFromStationSelect}
      {list}
    />
    <button
      class="absolute right-3 top-7 w-6 flex z-[5] justify-center items-center md:-right-4 md:top-1.5 md:rotate-90"
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
      id="to-station"
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
    {#if validationErrors?.toStation}
      {#each validationErrors.toStation as err}
        <p class="text-sm text-error">{err}</p>
      {/each}
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

<section class="flex flex-col gap-4 mt-4">
  {#if trainsOnDate}
    <section class="border-solid border-2 rounded-md p-2">
      {trainsOnDate?.length} results |
      <span class="text-nowrap">
        {lastSelectedFromStation?.stationName}
        &rightarrow;
        {lastSelectedToStation?.stationName}
      </span>
      | {df.format(new Date(lastSelectedDate))}
    </section>

    <section class="flex flex-col gap-2">
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
    <div class="py-4 px-4 bg-info text-info-foreground rounded-md">
      Train on alternate days
    </div>

    <section class="border-solid border-2 rounded-md p-2">
      {trainsOnAlternateDate?.length} results |
      <span class="text-nowrap">
        {lastSelectedFromStation?.stationName}
        &rightarrow;
        {lastSelectedToStation?.stationName}
      </span>
      | {df.format(new Date(lastSelectedDate))}
    </section>

    <section class="flex flex-col gap-2">
      {#each trainsOnAlternateDate as train (train.trainId)}
        <TrainBtwStation
          {train}
          fromStation={stationIdMap.get(train.stationFrom.stationId)}
          toStation={stationIdMap.get(train.stationTo.stationId)}
        />
      {/each}
    </section>
  {/if}
</section>
