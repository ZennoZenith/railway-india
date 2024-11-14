<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
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
import type { ActionData, SubmitFunction } from "./$types";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();

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

const action: SubmitFunction = (
  { formData, cancel },
) => {
  const { fromStation, toStation } = Object.fromEntries(formData);

  console.log("hello");

  // if (trainNumber.toString().trim().length === 0) {
  //   toastState.error("Invalid train number");
  //   cancel();
  // }

  return async ({ result }) => {
    switch (result.type) {
      case "success":
        if (result.data?.data) {
          result.data.data.sort((a, b) => a.durationSec - b.durationSec);
        }
        break;
      case "error":
        toastState.error(result.error);
        break;
      case "failure":
        if (result.data?.fromStation.error) {
          toastState.error(
            result.data.fromStation.error ?? fromStation.toString(),
          );
        }
        if (result.data?.toStation.error) {
          toastState.error(
            result.data.toStation.error ?? toStation.toString(),
          );
        }
        if (result.data?.error?.error) {
          toastState.error(
            result.data.error.error,
          );
        }

        break;
    }
    await applyAction(result);
    await invalidateAll();
  };
};
</script>

<main class="max-w-[960px] p-4 mx-auto">
  <form
    class="grid grid-cols-1 gap-2"
    action="/"
    method="POST"
    use:enhance={action}
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

  <section class="mt-8 flex flex-col gap-2">
    {#if form?.data}
      {#each form.data as train (train.trainId)}
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
            <div class="flex flex-col text-right">
              <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
                {train.stationTo.stationName}
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
    {/if}
  </section>
</main>

<style>
</style>
