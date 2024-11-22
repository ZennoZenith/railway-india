import { browser } from "$app/environment";
import { SECONDS_IN_A_DAY, trainTimeToSeconds } from "$lib";
import type { TrainClassTypeXX, TrainsBetweenStations, TrainsBetweenStationsTrains } from "api-railway/dist/types";

type FilterTypes = "classes" | "trainTypes" | "departures" | "arrivals";
export class Filter {
  readonly journeyClasses: {
    id: string;
    text: string;
    data: TrainClassTypeXX | "OTHER";
    checked: boolean;
  }[] = [
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
  ];

  readonly trainTypes = [
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
  ];

  readonly departureTimes = [
    {
      id: "filter-departure-time-em",
      text: "Early Morning",
      value: "00:00 - 06:00",
      checked: true,
      startTime: 0,
      endTime: trainTimeToSeconds("5:59:59"),
    },
    {
      id: "filter-departure-time-m",
      text: "Morning",
      value: "06:00 - 12:00",
      checked: true,
      startTime: trainTimeToSeconds("06:00"),
      endTime: trainTimeToSeconds("11:59:59"),
    },
    {
      id: "filter-departure-time-a",
      text: "Mid Day",
      value: "12:00 - 18:00",
      checked: true,
      startTime: trainTimeToSeconds("12:00"),
      endTime: trainTimeToSeconds("17:59:59"),
    },
    {
      id: "filter-departure-time-n",
      text: "Night",
      value: "18:00 - 24:00",
      checked: true,
      startTime: trainTimeToSeconds("18:00"),
      endTime: trainTimeToSeconds("23:59:59"),
    },
  ];

  readonly arrivalTimes = [
    {
      id: "filter-arrival-time-em",
      text: "Early Morning",
      value: "00:00 - 06:00",
      checked: true,
      startTime: 0,
      endTime: trainTimeToSeconds("5:59:59"),
    },
    {
      text: "Morning",
      id: "filter-arrival-time-m",
      value: "06:00 - 12:00",
      checked: true,
      startTime: trainTimeToSeconds("06:00"),
      endTime: trainTimeToSeconds("11:59:59"),
    },
    {
      id: "filter-arrival-time-a",
      text: "Mid Day",
      value: "12:00 - 18:00",
      checked: true,
      startTime: trainTimeToSeconds("12:00"),
      endTime: trainTimeToSeconds("17:59:59"),
    },
    {
      id: "filter-arrival-time-n",
      text: "Night",
      value: "18:00 - 24:00",
      checked: true,
      startTime: trainTimeToSeconds("18:00"),
      endTime: trainTimeToSeconds("23:59:59"),
    },
  ];

  readonly sortOptions = [
    { value: "duration-a", text: "Duration Early First", label: "Duration ↓" },
    { value: "duration-d", text: "Duration Late First", label: "Duration ↑" },
    { value: "departure-a", text: "Departure Early First", label: "Departure ↓" },
    { value: "departure-d", text: "Departure Late First", label: "Departure ↑" },
    { value: "arrival-a", text: "Arrival Early First", label: "Arrival ↓" },
    { value: "arrival-d", text: "Arrival Late First", label: "Arrival ↑" },
  ] as const;

  filterOpenState = $state(false);
  selectedSortOptions: typeof this.sortOptions[number] = $state(this.sortOptions[0]);

  private trainsOnDate: TrainsBetweenStationsTrains[] = [];
  private trainsOnAlternateDate: TrainsBetweenStationsTrains[] = [];

  filteredTrainsOnDate: TrainsBetweenStationsTrains[] = $state([]);
  filteredTrainsOnAlternateDate: TrainsBetweenStationsTrains[] = $state([]);

  private readonly INDEX_OF_OTHER_CLASS: number;
  private readonly INDEX_OF_OTHER_TRAIN_TYPE: number;
  constructor() {
    if (browser && window.innerWidth >= 1536) {
      this.filterOpenState = true;
    }

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

  selectAll(t: FilterTypes) {
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
      this.trainsOnDate = [];
      this.trainsOnAlternateDate = [];
      return;
    }
    this.trainsOnDate = trains.trainsOnDate;
    this.trainsOnAlternateDate = trains.trainsOnAlternateDate;
    this.filter();
  }

  setSortOptions(value: string) {
    const opt = this.sortOptions.find(v => v.value === value);
    if (!opt) {
      console.error("Invalid sort option, value: ", value);
      return;
    }

    if (opt.value === this.selectedSortOptions.value) return;

    this.selectedSortOptions = opt;
    this.sort();
  }

  setCheckedState(type: FilterTypes, id: string, state: boolean) {
    switch (type) {
      case "classes":
        const c = this.journeyClasses.find(v => v.id === id);
        if (c) {
          c.checked = state;
        }
        break;
      case "trainTypes":
        const t = this.trainTypes.find(v => v.id === id);
        if (t) {
          t.checked = state;
        }
        break;
      case "departures":
        const d = this.departureTimes.find(v => v.id === id);
        if (d) {
          d.checked = state;
        }
        break;
      case "arrivals":
        const a = this.arrivalTimes.find(v => v.id === id);
        if (a) {
          a.checked = state;
        }
        break;
    }

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
    this.filteredTrainsOnDate = this.trainsOnDate
      .filter(this.filterClasses)
      .filter(this.filterTrainTypes)
      .filter(this.filterDepartureTime)
      .filter(this.filterArrivalTime);

    this.filteredTrainsOnAlternateDate = this.trainsOnAlternateDate
      .filter(this.filterClasses)
      .filter(this.filterTrainTypes)
      .filter(this.filterDepartureTime)
      .filter(this.filterArrivalTime);

    this.sort();
  }

  sort() {
    let compareFn: (a: TrainsBetweenStationsTrains, b: TrainsBetweenStationsTrains) => number = () => 0;
    switch (this.selectedSortOptions.value) {
      case "duration-a":
        compareFn = (a, b) => a.durationSec - b.durationSec;
        break;
      case "duration-d":
        compareFn = (a, b) => b.durationSec - a.durationSec;
        break;
      case "departure-a":
        compareFn = (a, b) =>
          trainTimeToSeconds(a.stationFrom.departureTime) - trainTimeToSeconds(b.stationFrom.departureTime);
        break;
      case "departure-d":
        compareFn = (a, b) =>
          trainTimeToSeconds(b.stationFrom.departureTime) - trainTimeToSeconds(a.stationFrom.departureTime);
        break;
      case "arrival-a":
        compareFn = (a, b) => trainTimeToSeconds(a.stationTo.arrivalTime) - trainTimeToSeconds(b.stationTo.arrivalTime);
        break;
      case "arrival-d":
        compareFn = (a, b) => trainTimeToSeconds(b.stationTo.arrivalTime) - trainTimeToSeconds(a.stationTo.arrivalTime);
        break;
    }
    this.filteredTrainsOnDate.sort(compareFn);
    this.filteredTrainsOnAlternateDate.sort(compareFn);
  }

  clear() {
    this.trainsOnDate = [];
    this.trainsOnAlternateDate = [];
    this.filteredTrainsOnDate = [];
    this.filteredTrainsOnAlternateDate = [];
  }

  toggleFilter(value?: boolean) {
    if (value !== undefined) {
      this.filterOpenState = value;
    } else {
      this.filterOpenState = !this.filterOpenState;
    }
  }

  reset() {
    this.journeyClasses.forEach(v => v.checked = true);
    this.trainTypes.forEach(v => v.checked = true);
    this.departureTimes.forEach(v => v.checked = true);
    this.arrivalTimes.forEach(v => v.checked = true);
  }
}
