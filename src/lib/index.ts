// place files you want to import through the `$lib` alias in this folder.

export type TrainClassTypeXX = "1A" | "2A" | "3A" | "SL" | "GN";
export type TrainType = "SKR";
export type StationType = "regular" | "junction";
export type TrainTime = `${string}:${string}:${string}`;
export type TimeString = string;

export type Train = {
  id: number;
  trainNumber: string;
  trainName: string;
  trainFullName: string | undefined;
  trainRunningDays: {
    sunday: boolean;
    monday: boolean;
    tueday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  availableClasses: TrainClassTypeXX[];
  hasPantry: true;
  trainTypeCode: TrainType;
  returnTrainNumber: string | undefined;
  stationFrom: {
    id: number;
    stationCode: string;
    stationName: string;
    stationType: StationType;
  };
  stationTo: {
    id: number;
    stationCode: string;
    stationName: string;
    stationType: StationType;
  };
  departureTime: TrainTime;
  arrivalTime: TrainTime;
  durationSec: number;
  distance: number;
  avgSpeed: number;
  numberOfStops: number;
  isActive: boolean;
  updatedAt: TimeString;
};
