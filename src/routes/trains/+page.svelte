<script lang="ts">
import { Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { CreateSearchable } from "$lib/search.svelte";
import type { DropDownListItem } from "$lib/types";
import type { TrainGeneralInfo, TrainInfo } from "api-railway/dist/types";
import { tick } from "svelte";
import TrainInfoComp from "./TrainInfo.svelte";

let response = $state<
  Superposition<{ trainNumber: [string] }, TrainInfo>
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
  const errorJson = await fetchJson<Superposition<{}, TrainGeneralInfo[]>>(
    "/api/trains/search",
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
      dataText: v.trainNumber,
      text: `(${v.trainNumber}) ${v.trainName}`,
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

  const trainNumber = formEntries.trainNumber?.toString().trim();
  if (!trainNumber || trainNumber.length === 0) {
    response = {
      success: false,
      httpCode: 400,
      error: {
        type: "VALIDATION",
        data: {
          trainNumber: ["train number invalid"],
        },
        messages: ["Validation error"],
      },
    } as Superposition<{ trainNumber: [string] }, TrainInfo>;
    return;
  }

  const errorJson = await fetchJson<Superposition<{}, TrainInfo>>(
    "/api/trains",
    {
      method: "POST",
      body: JSON.stringify({ trainNumber }),
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
      placeholder="Train number"
      bind:value={formInputValue}
      autocomplete="off"
      onfocus={searchable.onFocus}
      oninput={onInputChange}
    />
    <input
      type="hidden"
      name="trainNumber"
      value={selectedItem?.dataText ?? ""}
    >
    {#if response?.success === false && response.error.type === "VALIDATION"}
      <p class="text-error text-sm">
        {response.error.data.trainNumber[0]}
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
  {@const trainInfo = response.data}
  <TrainInfoComp {trainInfo} />
{/if}
