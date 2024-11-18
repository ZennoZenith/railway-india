<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { Debounce, fetchJson, type Superposition } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import type { StationGeneralInfo } from "api-railway/dist/stations";
import { tick } from "svelte";
import type { ActionData, SubmitFunction } from "./$types";
import type { FormError } from "./+page.server";
import StationInfo from "./StationInfo.svelte";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();
let formInputValue: string = $state("");
let formRef: HTMLFormElement;
const toastState = getToastState();
let searchable = new CreateSearchable();
const debounce = new Debounce();
let selectedItem = $state<DropDownListItem>();
let list = $state<DropDownListItem[]>([]);

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  resetError("stationCode");
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

function resetError(_key: keyof FormError) {
  // if (form?.success === false && form.error.hasOwnProperty(key)) {
  //   form.error[key] = undefined;
  // }
}

const submit: SubmitFunction = (
  { formData, cancel },
) => {
  const { stationCode } = Object.fromEntries(formData);
  if (stationCode.toString().trim().length === 0) {
    toastState.error("Invalid station code");
    cancel();
  }

  return async ({ result }) => {
    switch (result.type) {
      case "error":
        toastState.error(result.error);
        break;
      case "failure":
        if (result.data?.returnType === "Error") {
          toastState.error(
            result.data.error.stationCode ?? stationCode.toString(),
          );
        }
        break;
    }
    await applyAction(result);
    await invalidateAll();
  };
};
</script>

<form
  bind:this={formRef}
  class="flex justify-center"
  action="/stations"
  method="POST"
  use:enhance={submit}
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
    {#if form?.returnType === "Error" && form.error.stationCode}
      <p class="text-error text-sm">
        {form.error.stationCode}
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

{#if form?.returnType === "Station"}
  {@const station = form.data}
  <StationInfo {station} />
{/if}
