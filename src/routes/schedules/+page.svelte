<script lang="ts">
import { enhance } from "$app/forms";
import type { ActionData } from "./$types";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();
</script>

<form
  action="/schedules"
  method="POST"
  class="mx-auto mb-2 max-w-max"
  use:enhance
>
  <div class="flex join mb-4">
    <label class="form-control w-full">
      <input
        type="text"
        placeholder="Train number"
        name="trainNumber"
        class="input input-bordered w-full join-item"
        value={form?.trainNumber || ""}
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
  </div>
  <label class="w-full">
    <input
      type="checkbox"
      class="checkbox-primary inline"
      name="fullSchedule"
    >
    Full schedule
  </label>
</form>

{#if form?.success}
  {@const schedule = form.schedule}
  <section
    id="schedule"
    class="grid border-2 border-solid border-primary overflow-x-auto"
  >
    <div class="border-r-2 border-b-2 border-solid border-primary">Sr No.</div>
    <div class="border-r-2 border-b-2 border-solid border-primary">Station</div>
    <div class="border-r-2 border-b-2 border-solid border-primary">
      Arrival Time
    </div>
    <div class="border-r-2 border-b-2 border-solid border-primary">
      Departure Time
    </div>
    <div class="border-r-2 border-b-2 border-solid border-primary">
      Halt Time
    </div>
    <div class="border-r-2 border-b-2 border-solid border-primary">Speed</div>
    <div class="border-r-2 border-b-2 border-solid border-primary">
      Platform
    </div>
    <div class="border-r-2 border-b-2 border-solid border-primary">Day</div>
    <div class="border-r-2 border-b-2 border-solid border-primary">
      Distance (km)
    </div>
    <div class="border-b-2 border-solid border-primary">Avg. Speed (km/h)</div>
    {#each schedule as row}
      <div class="border-r-2 border-solid border-primary">{row.srNo}</div>
      <div class="border-r-2 border-solid border-primary">
        {row.station.stationCode}
      </div>
      <div class="border-r-2 border-solid border-primary">
        {row.arrivalTime?.slice(0, 5)}
      </div>
      <div class="border-r-2 border-solid border-primary">
        {row.departureTime?.slice(0, 5)}
      </div>
      <div class="border-r-2 border-solid border-primary">
        {row.haltTime?.slice(0, 5)}
      </div>
      <div class="border-r-2 border-solid border-primary">{row.speed}</div>
      <div class="border-r-2 border-solid border-primary">{row.platform}</div>
      <div class="border-r-2 border-solid border-primary">{row.dayCount}</div>
      <div class="border-r-2 border-solid border-primary">{row.distance}</div>
      <div>{row.speed}</div>
    {/each}
  </section>
{/if}
<style>
#schedule {
  grid-template-columns: repeat(10, minmax(6em, 1fr));
}
#schedule > div {
  display: flex;
  justify-content: center;
}
</style>
