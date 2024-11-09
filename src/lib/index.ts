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
