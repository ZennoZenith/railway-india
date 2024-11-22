<script lang="ts">
import { Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { CreateSearchable } from "$lib/search.svelte";
import type { DropDownListItem } from "$lib/types";
import type { StationGeneralInfo, StationInfo } from "api-railway/dist/types";
import { tick } from "svelte";
import StationInfoComp from "./StationInfo.svelte";

let response = $state<
  Superposition<{ stationCode: [string] }, StationInfo>
>();
let formInputValue: string = $state("");
let formRef: HTMLFormElement;
let searchable = new CreateSearchable();
const debounce = new Debounce();
let selectedItem = $state<DropDownListItem>();
let list = $state<DropDownListItem[]>([]);

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  if (event.currentTarget.value.trim().length === 0) {
    return;
  }
  debounce.debounceAsync(autocomplete)(event.currentTarget.value);
}

async function autocomplete() {
  const errorJson = await fetchJson<Superposition<{}, StationGeneralInfo[]>>(
    "/api/stations/search",
    {
      method: "POST",
      body: JSON.stringify({ q: formInputValue }),
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

function onSelect() {
  formInputValue = selectedItem?.text ?? "";
  if (selectedItem?.dataText) {
    tick().then(() => {
      formRef.requestSubmit();
    });
  }
}

async function onFormSubmit(
  event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const formEntries = Object.fromEntries(formData.entries());

  const stationCode = formEntries.stationCode?.toString().trim();
  if (!stationCode || stationCode.length === 0) {
    response = {
      success: false,
      httpCode: 400,
      error: {
        type: "VALIDATION",
        data: {
          stationCode: ["station code invalid"],
        },
        messages: ["Validation error"],
      },
    } as Superposition<{ stationCode: [string] }, StationInfo>;
    return;
  }

  const errorJson = await fetchJson<Superposition<{}, StationInfo>>(
    "/api/stations",
    {
      method: "POST",
      body: JSON.stringify({ stationCode }),
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
    response = errorJson.data;
  }
}
</script>

<form
  bind:this={formRef}
  class="flex justify-center"
  onsubmit={onFormSubmit}
>
  <div
    class="relative w-full max-w-[480px]"
    onfocusout={searchable.onFocusLoss}
  >
    <Input
      class="w-full"
      type="text"
      placeholder="Station name/code"
      bind:value={formInputValue}
      autocomplete="off"
      onfocus={searchable.onFocus}
      onkeyup={onInputChange}
    />
    <input
      type="hidden"
      name="stationCode"
      value={selectedItem?.dataText ?? ""}
    >
    {#if response?.success === false && response.error.type === "VALIDATION"}
      <p class="text-error text-sm">
        {response.error.data.stationCode[0]}
      </p>
    {/if}
    <Dropdown
      {searchable}
      bind:selectedItem
      {list}
      {onSelect}
    />
  </div>
  <Button type="submit">Search</Button>
</form>

{#if response?.success === true}
  {@const station = response.data}
  <StationInfoComp {station} />
{/if}
