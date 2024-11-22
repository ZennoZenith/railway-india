<script lang="ts">
import { Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import SwapVertical from "$lib/components/swap-vertical-svgrepo-com.svelte";
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import * as Select from "$lib/components/ui/select";
import { Separator } from "$lib/components/ui/separator";
import { Toggle } from "$lib/components/ui/toggle";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
} from "@internationalized/date";
import type {
  StationGeneralInfo,
  TrainsBetweenStations,
} from "api-railway/dist/types";
import { untrack } from "svelte";
import { CaretDown, CaretLeft, CaretRight, CaretUp } from "svelte-radix";
import {
  validateSchema,
  type ValidationError,
} from "./api/trainsBtwStations/search/schema";
import DatePicker from "./DatePicker.svelte";
import FilterCheckbox from "./FilterCheckbox.svelte";
import { Filter } from "./filters.svelte";
import TrainBtwStation from "./TrainBtwStation.svelte";

const filters = new Filter();
const todayDate = new Date();
const debounce = new Debounce();
const toastState = getToastState();
const fromStationSearchable = new CreateSearchable(100);
const toStationSearchable = new CreateSearchable(100);
const stationIdMap = new Map<number, StationGeneralInfo>();
const df = new DateFormatter("en-US", { dateStyle: "full" });

let formRef = $state<HTMLFormElement>();
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

// this variable is just used to rerender filter checkbox when select all is selected
let rerenderFilter = $state(0);

let formatedDate = $derived(
  date ? date.toString() : null,
);
let list = $state<DropDownListItem[]>([]);
let fromStationSelected = $state<DropDownListItem>();
let toStationSelected = $state<DropDownListItem>();
let lastSelectedFromStation = $state<StationGeneralInfo>();
let lastSelectedToStation = $state<StationGeneralInfo>();
let lastSelectedDate = $state<string | null>(null);

let response = $state<Superposition<ValidationError, TrainsBetweenStations>>();

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
      } else {
        filters.setTrains(response.data);
      }
      return;
    }

    filters.clear();
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

  // focus next input field
  toStationInputRef?.focus();
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

function onClickNextDay() {
  date = date.add({ days: 1 });
  formRef?.requestSubmit();
}

function onClickPrevDay() {
  date = date.subtract({ days: 1 });
  formRef?.requestSubmit();
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
  bind:this={formRef}
  class="grid grid-cols-1 md:grid-cols-4 gap-2 max-w-[960px] mx-auto"
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

<section class="main-section grid gap-4 py-4">
  <div
    class="filter-section transition-all"
    class:filter-is-open={filters.filterOpenState}
  >
    <div class="flex justify-between">
      <Button variant="outline" onclick={() => filters.toggleFilter()}>
        {#if filters.filterOpenState}
          Hide filters <CaretUp />
        {:else}
          Show filters <CaretDown />
        {/if}
      </Button>
      <Button
        variant="outline"
        onclick={() => {
          filters.reset();
          rerenderFilter += 1;
        }}
      >
        Reset filters
      </Button>
    </div>

    <div
      aria-expanded={filters.filterOpenState}
      class="mt-4 grid grid-cols-1 md:grid-cols-2 2xl:flex 2xl:flex-col gap-5 overflow-hidden"
    >
      <div class="flex flex-col gap-2">
        <Separator />
        <div class="flex justify-between items-center">
          <span>JOURNEY CLASS</span>
          <Button
            class="h-5 p-2"
            type="button"
            onclick={() => {
              filters.selectAll("classes");
              rerenderFilter += 1;
            }}
          >
            Select all
          </Button>
        </div>
        <Separator />
        {#key rerenderFilter}
          <div class="grid grid-cols-2 gap-2">
            {#each filters.journeyClasses as { id, text, data, checked } (id)}
              <FilterCheckbox
                {id}
                {text}
                {data}
                {checked}
                onCheckedChange={s => filters.setCheckedState("classes", id, s)}
              />
            {/each}
          </div>
        {/key}
      </div>

      <div class="flex flex-col gap-2">
        <Separator />
        <div class="flex justify-between items-center">
          <span>TRAIN TYPE</span>
          <Button
            class="h-5 p-2"
            type="button"
            onclick={() => {
              filters.selectAll("trainTypes");
              rerenderFilter += 1;
            }}
          >
            Select all
          </Button>
        </div>
        <Separator />
        {#key rerenderFilter}
          <div class="grid grid-cols-1 gap-2">
            {#each filters.trainTypes as
              { id, text, data, checked, color }
              (id)
            }
              <FilterCheckbox
                {id}
                {text}
                {data}
                {checked}
                onCheckedChange={s => filters.setCheckedState("trainTypes", id, s)}
                {color}
              />
            {/each}
          </div>
        {/key}
      </div>

      <div class="flex flex-col gap-2">
        <Separator />
        <div class="flex justify-between items-center">
          <span>DEPARTURE TIME</span>
          <Button
            class="h-5 p-2"
            type="button"
            onclick={() => {
              filters.selectAll("departures");
              rerenderFilter += 1;
            }}
          >
            Select all
          </Button>
        </div>
        <Separator />
        {#key rerenderFilter}
          <div class="grid grid-cols-2 gap-2">
            {#each filters.departureTimes as { id, checked, text, value } (id)}
              <Toggle
                variant="outline"
                aria-label={value}
                class="h-16 flex-col hover:bg-inherit"
                {id}
                onPressedChange={s => filters.setCheckedState("departures", id, s)}
                pressed={checked}
              >
                <span>{value}</span>
                <span>{text}</span>
              </Toggle>
            {/each}
          </div>
        {/key}
      </div>

      <div class="flex flex-col gap-2">
        <Separator />
        <div class="flex justify-between items-center">
          <span>ARRIVAL TIME</span>
          <Button
            class="h-5 p-2"
            type="button"
            onclick={() => {
              filters.selectAll("arrivals");
              rerenderFilter += 1;
            }}
          >
            Select all
          </Button>
        </div>
        <Separator />
        {#key rerenderFilter}
          <div class="grid grid-cols-2 gap-2">
            {#each filters.arrivalTimes as { id, checked, text, value } (id)}
              <Toggle
                variant="outline"
                aria-label={value}
                class="h-16 flex-col hover:bg-inherit"
                {id}
                onPressedChange={s => filters.setCheckedState("arrivals", id, s)}
                pressed={checked}
              >
                <span>{value}</span>
                <span>{text}</span>
              </Toggle>
            {/each}
          </div>
        {/key}
      </div>
    </div>
  </div>

  {#if response?.success === true}
    <section class="flex gap-4 sm:flex-row flex-col-reverse">
      <div class="flex items-center gap-2 mr-auto">
        Sort by
        <Select.Root
          type="single"
          name="sortBy"
          onValueChange={v => filters.setSortOptions(v)}
          value={filters.selectedSortOptions.value}
        >
          <Select.Trigger class="w-36">
            {filters.selectedSortOptions.label}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each filters.sortOptions as opt}
                <Select.Item value={opt.value} label={opt.text} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex justify-between gap-2">
        <Button type="button" onclick={onClickPrevDay}>
          <CaretLeft /> Prev. Day
        </Button>
        <Button type="button" onclick={onClickNextDay}>
          Next Day <CaretRight />
        </Button>
      </div>
    </section>
  {/if}
  <section class="flex flex-col gap-4 mt-4">
    {#if filters.filteredTrainsOnDate.length > 0}
      <section class="border-solid border-2 rounded-md p-2">
        {filters.filteredTrainsOnDate.length} results |
        <span class="text-nowrap">
          {lastSelectedFromStation?.stationName}
          &rightarrow;
          {lastSelectedToStation?.stationName}
        </span>
        {#if lastSelectedDate}
          | {df.format(new Date(lastSelectedDate))}
        {:else}
          | INVALID DATE
        {/if}
      </section>

      <section class="flex flex-col gap-2">
        {#each filters.filteredTrainsOnDate as train (train.trainId)}
          <TrainBtwStation
            {train}
            fromStation={stationIdMap.get(train.stationFrom.stationId)}
            toStation={stationIdMap.get(train.stationTo.stationId)}
          />
        {/each}
      </section>
    {/if}

    <!-- ------------------------  -->
    {#if filters.filteredTrainsOnAlternateDate.length > 0}
      {#if filters.filteredTrainsOnDate.length !== 0}
        <Separator class="my-14" />
      {/if}

      <div class="py-4 px-4 bg-info text-info-foreground rounded-md">
        Train on alternate days
      </div>

      <section class="border-solid border-2 rounded-md p-2">
        {filters.filteredTrainsOnAlternateDate.length} results |
        <span class="text-nowrap">
          {lastSelectedFromStation?.stationName}
          &rightarrow;
          {lastSelectedToStation?.stationName}
        </span>
        {#if lastSelectedDate}
          | {df.format(new Date(lastSelectedDate))}
        {:else}
          | "INVALID DATE"
        {/if}
      </section>

      <section class="flex flex-col gap-2 2xl:">
        {#each filters.filteredTrainsOnAlternateDate as train (train.trainId)}
          <TrainBtwStation
            {train}
            fromStation={stationIdMap.get(train.stationFrom.stationId)}
            toStation={stationIdMap.get(train.stationTo.stationId)}
          />
        {/each}
      </section>
    {/if}
  </section>
</section>

<style>
.main-section {
  grid-template-columns: 1fr;
}

.filter-section {
  display: grid;
  grid-template-rows: auto 0fr;
}

.filter-section.filter-is-open {
  grid-template-rows: auto 1fr;
}

:global(main) {
  max-width: unset !important;
}

@media (min-width: 1536px) {
  .main-section {
    grid-template-columns: auto 1fr;
  }
}
</style>
