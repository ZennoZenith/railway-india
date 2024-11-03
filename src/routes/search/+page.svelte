<script lang="ts">
import type { Train } from "$lib";
import LocationPin from "$lib/components/location-pin.svelte";

let trainsData: Train[] = [
  {
    "id": 980,
    "trainNumber": "12650",
    "trainName": "YPR SAMPARK KRT",
    "trainFullName": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
    "trainRunningDays": {
      "sunday": true,
      "monday": true,
      "tueday": true,
      "wednesday": false,
      "thursday": true,
      "friday": false,
      "saturday": true,
    },
    "availableClasses": [
      "1A",
      "2A",
      "3A",
      "SL",
      "GN",
    ],
    "hasPantry": true,
    "trainTypeCode": "SKR",
    "returnTrainNumber": "12649",
    "stationFrom": {
      "id": 745,
      "stationCode": "NZM",
      "stationName": "Hazrat Nizamuddin",
      "stationType": "regular",
    },
    "stationTo": {
      "id": 994,
      "stationCode": "YPR",
      "stationName": "Yesvantpur Junction",
      "stationType": "junction",
    },
    "departureTime": "08:20:00",
    "arrivalTime": "04:30:00",
    "durationSec": 159000,
    "distance": 2748,
    "avgSpeed": 59,
    "numberOfStops": 19,
    "isActive": true,
    "updatedAt": "2024-08-04T12:06:52.807Z",
  },
  {
    "id": 981,
    "trainNumber": "12650",
    "trainName": "YPR SAMPARK KRT",
    "trainFullName": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
    "trainRunningDays": {
      "sunday": true,
      "monday": true,
      "tueday": true,
      "wednesday": false,
      "thursday": true,
      "friday": false,
      "saturday": true,
    },
    "availableClasses": [
      "1A",
      "2A",
      "3A",
      "SL",
      "GN",
    ],
    "hasPantry": true,
    "trainTypeCode": "SKR",
    "returnTrainNumber": "12649",
    "stationFrom": {
      "id": 745,
      "stationCode": "NZM",
      "stationName": "Hazrat Nizamuddin",
      "stationType": "regular",
    },
    "stationTo": {
      "id": 994,
      "stationCode": "YPR",
      "stationName": "Yesvantpur Junction",
      "stationType": "junction",
    },
    "departureTime": "08:20:00",
    "arrivalTime": "04:30:00",
    "durationSec": 159000,
    "distance": 2748,
    "avgSpeed": 59,
    "numberOfStops": 19,
    "isActive": true,
    "updatedAt": "2024-08-04T12:06:52.807Z",
  },
  {
    "id": 982,
    "trainNumber": "12650",
    "trainName": "YPR SAMPARK KRT",
    "trainFullName": "Karnataka Sampark Kranti Express (Via Ballari) (PT)",
    "trainRunningDays": {
      "sunday": true,
      "monday": true,
      "tueday": true,
      "wednesday": false,
      "thursday": true,
      "friday": false,
      "saturday": true,
    },
    "availableClasses": [
      "1A",
      "2A",
      "3A",
      "SL",
      "GN",
    ],
    "hasPantry": true,
    "trainTypeCode": "SKR",
    "returnTrainNumber": "12649",
    "stationFrom": {
      "id": 745,
      "stationCode": "NZM",
      "stationName": "Hazrat Nizamuddin",
      "stationType": "regular",
    },
    "stationTo": {
      "id": 994,
      "stationCode": "YPR",
      "stationName": "Yesvantpur Junction",
      "stationType": "junction",
    },
    "departureTime": "08:20:00",
    "arrivalTime": "04:30:00",
    "durationSec": 159000,
    "distance": 2748,
    "avgSpeed": 59,
    "numberOfStops": 19,
    "isActive": true,
    "updatedAt": "2024-08-04T12:06:52.807Z",
  },
];
</script>

<div>
  {#each trainsData as train (train.id)}
    <section class="m-2 border-solid border-2 rounded-xl">
      <div
        class="p-2 flex justify-between bg-neutral rounded-t-xl text-neutral-content"
      >
        <div>{train.trainName} ({train.trainNumber})</div>
        <button class="w-6">
          <LocationPin />
        </button>
      </div>
      <section class="p-2 grid grid-cols-3">
        <div>{train.departureTime?.slice(0, 5)}</div>
        <div class="flex justify-center">{train.durationSec / 60}</div>
        <div class="flex justify-end">{train.arrivalTime?.slice(0, 5)}</div>

        <div class="">
          <div>{train.stationFrom.stationName}</div>
          <div>Departure date</div>
        </div>
        <div class="flex justify-center items-center">M T W T F S S</div>
        <div class="">
          <div class="flex justify-end">{train.stationTo.stationName}</div>
          <div class="flex justify-end">Arrival date</div>
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
</div>

<style>
</style>
