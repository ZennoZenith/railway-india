<script lang="ts">
import { enhance } from "$app/forms";
import type { ActionData } from "./$types";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();
</script>

<form
  action="/stations"
  method="POST"
  class="mx-auto flex mb-2 join max-w-max"
  use:enhance
>
  <label class="form-control w-full">
    <input
      type="text"
      placeholder="Station name"
      name="stationCode"
      class="input input-bordered w-full join-item"
      value={form?.data?.stationCode || ""}
    />
    {#if form?.success === false}
      <div class="label">
        <span class="label-text text-error">
          {form.station}
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

{#if form?.success}
  {@const data = form.data}
  <section class="grid grid-cols-2 mx-auto w-max">
    <div>Station Code</div>
    <div>{data.stationCode}</div>
    <div>Station Name</div>
    <div>{data.stateName}</div>
    <div>State</div>
    <div>{data.stateName}</div>
    <div>Zone</div>
    <div>{data.zoneCode}</div>
    <div>Station alternate name</div>
    <div>{data.stationAlternateText}</div>
    <div>Type</div>
    <div>{data.stationType}</div>
    <div>Number of platforms</div>
    <div>{data.numberOfPlatforms}</div>
    <div>Hindi station name</div>
    <div>{data.hindiStationName}</div>
    <div>Latitude</div>
    <div>{data.latitude}</div>
    <div>Longitude</div>
    <div>{data.longitude}</div>
  </section>
{/if}
