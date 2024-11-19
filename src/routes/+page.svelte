<script lang="ts">
import {
  Debounce,
  fetchJson,
  type Superposition,
  trainTimeToSeconds,
} from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import SwapVertical from "$lib/components/swap-vertical-svgrepo-com.svelte";
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
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
import type { StationGeneralInfo } from "api-railway/dist/stations";
import type {
  TrainsBetweenStations,
  TrainsBetweenStationsTrains,
} from "api-railway/dist/trainsBtwStations";
import type { TrainClassTypeXX } from "api-railway/dist/types";
import { untrack } from "svelte";
import {
  validateSchema,
  type ValidationError,
} from "./api/trainsBtwStations/search/schema";
import DatePicker from "./DatePicker.svelte";
import FilterCheckbox from "./FilterCheckbox.svelte";
import TrainBtwStation from "./TrainBtwStation.svelte";

class Filter {
  readonly journeyClasses: {
    id: string;
    text: string;
    data: TrainClassTypeXX | "OTHER";
    checked: boolean;
  }[] = $state(
    [
      {
        id: "journey-class-1A",
        text: "AC First Class (1A)",
        data: "1A",
        checked: true,
      },
      {
        id: "journey-class-2A",
        text: "AC 2 Tier (2A)",
        data: "2A",
        checked: true,
      },
      {
        id: "journey-class-3A",
        text: "AC 3 Tier (3A)",
        data: "3A",
        checked: true,
      },
      {
        id: "journey-class-3E",
        text: "AC 3 Economy (3E)",
        data: "3E",
        checked: true,
      },
      {
        id: "journey-class-SL",
        text: "Sleeper (SL)",
        data: "SL",
        checked: true,
      },
      {
        id: "journey-class-EC",
        text: "Exec. Chair Car (EC)",
        data: "EC",
        checked: true,
      },
      {
        id: "journey-class-CC",
        text: "AC Chair Car (CC)",
        data: "CC",
        checked: true,
      },
      {
        id: "journey-class-2S",
        text: "Second Sitting (2S)",
        data: "2S",
        checked: true,
      },
      {
        id: "journey-class-GN",
        text: "General (GN)",
        data: "GN",
        checked: true,
      },
      {
        id: "journey-class-OTHER",
        text: "Others",
        data: "OTHER",
        checked: true,
      },
    ],
  );

  readonly trainTypes = $state(
    [
      {
        id: "train-type-DRNT",
        text: "Duronto",
        color: "orange",
        data: "DRNT",
        checked: true,
      },
      {
        id: "train-type-GR",
        text: "Garib Rath",
        color: "lime",
        data: "mutedgrey",
        checked: true,
      },
      {
        id: "train-type-RAJ",
        text: "Rajdhani",
        color: "crimson",
        data: "RAJ",
        checked: true,
      },
      {
        id: "train-type-SHTB",
        text: "Shatabdi",
        color: "dodgerblue",
        data: "SHTB",
        checked: true,
      },
      {
        id: "train-type-EXP",
        text: "Mail/Express",
        color: "violet",
        data: "EXP",
        checked: true,
      },
      {
        id: "train-type-OTHER",
        text: "Other",
        color: "dimgray",
        data: "OTHER",
        checked: true,
      },
    ],
  );

  readonly departureTimes = $state(
    [
      {
        text: "Early Morning",
        value: "00:00 - 06:00",
        checked: true,
        startTime: 0,
        endTime: trainTimeToSeconds("5:59:59"),
      },
      {
        text: "Morning",
        value: "06:00 - 12:00",
        checked: true,
        startTime: trainTimeToSeconds("06:00"),
        endTime: trainTimeToSeconds("11:59:59"),
      },
      {
        text: "Mid Day",
        value: "12:00 - 18:00",
        checked: true,
        startTime: trainTimeToSeconds("12:00"),
        endTime: trainTimeToSeconds("17:59:59"),
      },
      {
        text: "Night",
        value: "18:00 - 24:00",
        checked: true,
        startTime: trainTimeToSeconds("18:00"),
        endTime: trainTimeToSeconds("23:59:59"),
      },
    ],
  );

  readonly arrivalTimes = $state(
    [
      {
        text: "Early Morning",
        value: "00:00 - 06:00",
        checked: true,
        startTime: 0,
        endTime: trainTimeToSeconds("5:59:59"),
      },
      {
        text: "Morning",
        value: "06:00 - 12:00",
        checked: true,
        startTime: trainTimeToSeconds("06:00"),
        endTime: trainTimeToSeconds("11:59:59"),
      },
      {
        text: "Mid Day",
        value: "12:00 - 18:00",
        checked: true,
        startTime: trainTimeToSeconds("12:00"),
        endTime: trainTimeToSeconds("17:59:59"),
      },
      {
        text: "Night",
        value: "18:00 - 24:00",
        checked: true,
        startTime: trainTimeToSeconds("18:00"),
        endTime: trainTimeToSeconds("23:59:59"),
      },
    ],
  );

  private trainOnDate: TrainsBetweenStationsTrains[] = [];
  private trainsOnAlternateDate: TrainsBetweenStationsTrains[] = [];

  filteredTrainOnDate: TrainsBetweenStationsTrains[] = $state([]);
  filteredTrainsOnAlternateDate: TrainsBetweenStationsTrains[] = $state([]);

  private readonly INDEX_OF_OTHER_CLASS: number;
  private readonly INDEX_OF_OTHER_TRAIN_TYPE: number;
  constructor() {
    const i = this.journeyClasses.findIndex(v => v.data === "OTHER");
    if (i === -1) {
      throw new Error("No class filter found with value OTHER");
    }

    const j = this.trainTypes.findIndex(v => v.data === "OTHER");
    if (i === -1) {
      throw new Error("No train type filter found with value OTHER");
    }

    this.INDEX_OF_OTHER_CLASS = i;
    this.INDEX_OF_OTHER_TRAIN_TYPE = j;
  }

  selectAll(t: "classes" | "trainTypes" | "departures" | "arrivals") {
    switch (t) {
      case "classes":
        this.journeyClasses.forEach((v) => v.checked = true);
        break;
      case "trainTypes":
        this.trainTypes.forEach((v) => v.checked = true);
        break;
      case "departures":
        this.departureTimes.forEach((v) => v.checked = true);
        break;
      case "arrivals":
        this.arrivalTimes.forEach((v) => v.checked = true);
        break;
    }
    this.filter();
  }

  setTrains(trains?: TrainsBetweenStations) {
    if (!trains) {
      this.trainOnDate = [];
      this.trainsOnAlternateDate = [];
      return;
    }
    this.trainOnDate = trains.trainsOnDate;
    this.trainsOnAlternateDate = trains.trainsOnAlternateDate;
    this.filter();
  }

  private readonly filterClasses = (v: TrainsBetweenStationsTrains) => {
    let allChecked = true;
    for (const c of this.journeyClasses) {
      if (!c.checked) {
        allChecked = false;
      }

      if (
        c.checked && v.availableClasses.includes(c.data as TrainClassTypeXX)
      ) {
        return true;
      }
    }

    if (allChecked) {
      return true;
    }

    if (
      this.journeyClasses[this.INDEX_OF_OTHER_CLASS]
      && this.journeyClasses[this.INDEX_OF_OTHER_CLASS].checked
    ) {
      for (const c of this.journeyClasses) {
        if (
          v.availableClasses.includes(c.data as TrainClassTypeXX)
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  private readonly filterTrainTypes = (v: TrainsBetweenStationsTrains) => {
    let allChecked = true;

    for (const c of this.trainTypes) {
      if (!c.checked) {
        allChecked = false;
      }
      if (c.checked && v.trainTypeCode === c.data) {
        return true;
      }
    }

    if (allChecked) {
      return true;
    }

    if (
      this.trainTypes[this.INDEX_OF_OTHER_TRAIN_TYPE]
      && this.trainTypes[this.INDEX_OF_OTHER_TRAIN_TYPE].checked
    ) {
      for (const c of this.trainTypes) {
        if (v.trainTypeCode === c.data) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  private readonly filterDepartureTime = (v: TrainsBetweenStationsTrains) => {
    let allChecked = true;

    for (const c of this.departureTimes) {
      if (!c.checked) {
        allChecked = false;
      }
      const time = trainTimeToSeconds(v.stationFrom.departureTime);
      if (c.checked && time >= c.startTime && time < c.endTime) {
        return true;
      }
    }

    if (allChecked) {
      return true;
    }

    return false;
  };

  private readonly filterArrivalTime = (v: TrainsBetweenStationsTrains) => {
    let allChecked = true;

    for (const c of this.arrivalTimes) {
      if (!c.checked) {
        allChecked = false;
      }
      const time = trainTimeToSeconds(v.stationTo.arrivalTime);
      if (c.checked && time >= c.startTime && time < c.endTime) {
        return true;
      }
    }
    if (allChecked) {
      return true;
    }

    return false;
  };

  filter() {
    this.filteredTrainOnDate = this.trainOnDate
      .filter(this.filterClasses)
      .filter(this.filterTrainTypes)
      .filter(this.filterDepartureTime)
      .filter(this.filterArrivalTime);

    this.filteredTrainsOnAlternateDate = this.trainsOnAlternateDate
      .filter(this.filterClasses)
      .filter(this.filterTrainTypes)
      .filter(this.filterDepartureTime)
      .filter(this.filterArrivalTime);
  }

  clear() {
    this.trainOnDate = [];
    this.trainsOnAlternateDate = [];
    this.filteredTrainOnDate = [];
    this.filteredTrainsOnAlternateDate = [];
  }
}

$effect(() => {
  filters.journeyClasses;
  filters.trainTypes;
  filters.departureTimes;
  filters.arrivalTimes;
  filters.filter();
});

const filters = new Filter();
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

$effect(() => {
  if (response?.success) {
    filters.setTrains(response.data);
  } else {
    filters.clear();
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

<!-- Filter section -->
<section
  class="mt-4 md:grid grid-cols-2 2xl:grid-cols-1 sm:grid-cols-1 gap-5 overflow-hidden"
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
        }}
      >
        Select all
      </Button>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      {#each filters.journeyClasses as f, i (f.id)}
        <FilterCheckbox
          id={f.id}
          text={f.text}
          data={f.data}
          bind:checked={filters.journeyClasses[i].checked}
        />
      {/each}
    </div>
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
        }}
      >
        Select all
      </Button>
    </div>
    <Separator />
    <div class="grid grid-cols-1 gap-2">
      {#each filters.trainTypes as f, i (f.id)}
        <FilterCheckbox
          id={f.id}
          text={f.text}
          data={f.data}
          bind:checked={filters.trainTypes[i].checked}
          color={f.color}
        />
      {/each}
    </div>
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
        }}
      >
        Select all
      </Button>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      {#each filters.departureTimes as f, i (f.value)}
        <Toggle
          variant="outline"
          aria-label={f.value}
          class="h-16 flex-col hover:bg-inherit"
          bind:pressed={filters.departureTimes[i].checked}
        >
          <span>{f.value}</span>
          <span>{f.text}</span>
        </Toggle>
      {/each}
    </div>
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
        }}
      >
        Select all
      </Button>
    </div>
    <Separator />
    <div class="grid grid-cols-2 gap-2">
      {#each filters.arrivalTimes as f, i (f.value)}
        <Toggle
          variant="outline"
          aria-label={f.value}
          class="h-16 flex-col hover:bg-inherit"
          bind:pressed={filters.arrivalTimes[i].checked}
        >
          <span>{f.value}</span>
          <span>{f.text}</span>
        </Toggle>
      {/each}
    </div>
  </div>
</section>

<section class="flex flex-col gap-4 mt-4">
  {#if filters.filteredTrainOnDate.length > 0}
    <section class="border-solid border-2 rounded-md p-2">
      {filters.filteredTrainOnDate.length} results |
      <span class="text-nowrap">
        {lastSelectedFromStation?.stationName}
        &rightarrow;
        {lastSelectedToStation?.stationName}
      </span>
      | {df.format(new Date(lastSelectedDate))}
    </section>

    <section class="flex flex-col gap-2">
      {#each filters.filteredTrainOnDate as train (train.trainId)}
        <TrainBtwStation
          {train}
          fromStation={stationIdMap.get(train.stationFrom.stationId)}
          toStation={stationIdMap.get(train.stationTo.stationId)}
        />
      {/each}
    </section>
  {/if}

  <!-- ------------------------  -->
  {#if filters.filteredTrainsOnAlternateDate
    && filters.filteredTrainsOnAlternateDate.length > 0}
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
      | {df.format(new Date(lastSelectedDate))}
    </section>

    <section class="flex flex-col gap-2">
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
