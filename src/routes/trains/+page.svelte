<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { DurationSecToHM, trainRunsOnUtil } from "$lib";
import Search from "$lib/components/Search.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import type { ActionData, SubmitFunction } from "./$types";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();
const toastState = getToastState();

let list: DropDownListItem[] = [
  {
    key: "1",
    text: "Text 1",
    dataText: "DATA text 1",
  },
  {
    key: "2",
    text: "Text 2",
    dataText: "DATA text 2",
  },
  {
    key: "3",
    text: "Text 3",
    dataText: "DATA text 3",
  },
  {
    key: "4",
    text: "Text 4",
    dataText: "DATA text 4",
  },
  {
    key: "5",
    text: "Text 5",
    dataText: "DATA text 5",
  },
  {
    key: "6",
    text: "Text 6",
    dataText: "DATA text 6",
  },
  {
    key: "7",
    text: "Text 7",
    dataText: "DATA text 7",
  },
];

let selectedItemIndex = $state(-1);

const submit: SubmitFunction = (
  { formData, cancel },
) => {
  const { trainNumber } = Object.fromEntries(formData);
  if (trainNumber.toString().trim().length < 1) {
    toastState.error("Train number is empty");
    cancel();
  }

  return async ({ result }) => {
    switch (result.type) {
      case "redirect":
        break;
      case "error":
        toastState.error(result.error);
        break;
      case "success":
        // formElement.reset();
        break;
      case "failure":
        if (result.data?.success === false) {
          toastState.error(
            result.data.error.trainNumber ?? trainNumber.toString(),
          );
        }

        break;
    }
    // await update();
    await applyAction(result);
    await invalidateAll();
  };
};
</script>

<form
  action="/trains"
  method="POST"
  class="mx-auto flex mb-2 join max-w-max"
  use:enhance={submit}
>
  <label class="form-control w-full">
    <input
      type="text"
      placeholder="Train number"
      name="trainNumber"
      class="input input-bordered w-full join-item"
      value={form?.data?.trainNumber || ""}
    />
    {#if form?.success === false}
      <div class="label">
        <span class="label-text text-error">
          {form.error.trainNumber}
        </span>
      </div>
    {/if}
  </label>
  <button
    type="submit"
    class="btn btn-primary join-item"
  >
    Search
  </button>
</form>

<Search
  {list}
  {selectedItemIndex}
  setFirstAsDefault={true}
  class="input input-bordered w-full h-12"
  onSelect={(item) => {
    console.log(item);
  }}
/>

<Button>Click me</Button>

{#if form?.success}
  {@const data = form.data}
  <section class="grid grid-cols-2 mx-auto w-max">
    <div>Train Number</div>
    <div>{data.trainNumber}</div>
    <div>Train Name</div>
    <div>{data.trainName}</div>
    <div>Train Full Name</div>
    <div>{data.trainFullName}</div>
    <div>Train Runs On</div>
    <div class="flex gap-2">
      {#each trainRunsOnUtil(data.trainRunningDays) as day}
        {#if day.state}
          <span class="text-green-400">
            {day.text}
          </span>
        {:else}
          <span class="text-red-400">
            {day.text}
          </span>
        {/if}
      {/each}
    </div>

    <div>Available Classes</div>
    <div>{data.availableClasses.join(", ")}</div>
    <div>Pantry</div>
    <div>{data.hasPantry ? "Yes" : "No"}</div>
    <div>Train Type</div>
    <div>{data.trainTypeCode}</div>
    <div>Station From</div>
    <a href={`/stations/${data.stationFrom.stationCode}`}>
      {data.stationFrom.stationName} ({data.stationFrom.stationCode})</a>
    <div>Departure Time</div>
    <div>{data.departureTime}</div>
    <div>Station To</div>
    <a href={`/stations/${data.stationTo.stationCode}`}>
      {data.stationTo.stationName} ({data.stationTo.stationCode})</a>
    <div>Departure Time</div>
    <div>{data.arrivalTime}</div>
    <div>Duration</div>
    <div>{DurationSecToHM(data.durationSec)}</div>
    <div>Distance</div>
    <div>{data.distance} km</div>
    <div>Avrage Speed</div>
    <div>{data.avgSpeed} km/h</div>
    <div>Number of stops</div>
    <div>{data.numberOfStops}</div>
    <div>Return Train number</div>
    <div>{data.returnTrainNumber}</div>
  </section>
{/if}
