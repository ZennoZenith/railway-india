import type { TrainRunsOnDays } from "api-railway/dist/types";
// place files you want to import through the `$lib` alias in this folder.
export async function catchError<T, E = Error>(promise: Promise<T>): Promise<[undefined, T] | [E]> {
  try {
    const data = await promise;
    return [undefined, data] as [undefined, T];
  } catch (error) {
    return [error] as [E];
  }
}

export function uuidv4() {
  if (window?.isSecureContext) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(
    /[018]/g,
    c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16),
  );
}

export class Debounce {
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private waitTime: number;

  constructor(wait: number = 300) {
    this.waitTime = wait;
  }

  debounce = (callback: Function, wait?: number) => {
    wait ??= this.waitTime;
    return (...args: any[]) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => callback(...args), wait);
    };
  };

  debounceAsync = (callback: Function, wait?: number) => {
    wait ??= this.waitTime;
    return (...args: any[]) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => await callback(...args), wait);
    };
  };
}

export function DurationSecToHM(durationSec: number) {
  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor(Math.floor(durationSec % 3600) / 60);

  const ret: string[] = [];

  if (hours !== 0) {
    ret.push(`${hours}h`);
  }

  if (minutes !== 0) {
    ret.push(`${minutes}m`);
  }

  if (ret.length === 0) {
    ret.push("0m");
  }

  return ret.join(" ");
}

export function trainRunsOnUtil(trainRunningDays: TrainRunsOnDays) {
  const t = [
    { text: "M", state: false },
    { text: "T", state: false },
    { text: "W", state: false },
    { text: "T", state: false },
    { text: "F", state: false },
    { text: "S", state: false },
    { text: "S", state: false },
  ];

  if (trainRunningDays.monday) {
    t[0].state = true;
  }
  if (trainRunningDays.tueday) {
    t[1].state = true;
  }
  if (trainRunningDays.wednesday) {
    t[2].state = true;
  }
  if (trainRunningDays.thursday) {
    t[3].state = true;
  }
  if (trainRunningDays.friday) {
    t[4].state = true;
  }
  if (trainRunningDays.saturday) {
    t[5].state = true;
  }
  if (trainRunningDays.sunday) {
    t[6].state = true;
  }

  return t;
}

export function trainRunningDate(dayCount: number = 1, showYear: boolean = false, date: Date = new Date()) {
  dayCount -= 1;
  if (dayCount < 0) {
    dayCount = 0;
  }

  const newDate = new Date(date);
  newDate.setDate(date.getDate() + dayCount);
  const d = newDate.toDateString().split(" "); // 'Tue Nov 12 2024'
  return `${d[0]}, ${d[2]} ${d[1]} ${showYear ? d[3] : ""}`;
}
