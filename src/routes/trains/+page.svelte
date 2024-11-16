<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { catchError, Debounce } from "$lib";
import Dropdown from "$lib/components/Dropdown.svelte";
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import { tick } from "svelte";
import type { ActionData, SubmitFunction } from "./$types";
import type { FormError } from "./+page.server";
import TrainInfo from "./TrainInfo.svelte";

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
  resetError("trainNumber");
  if (event.currentTarget.value.trim().length === 0) {
    return;
  }
  debounce.debounceAsync(autocomplete)(event.currentTarget.value);
}

async function autocomplete() {
  const response = await catchError(fetch("/api/trains/search", {
    method: "POST",
    body: JSON.stringify({ q: formInputValue }),
    headers: {
      "content-type": "application/json",
    },
  }));

  if (response[0]) {
    console.error(response[0]);
    return;
  }

  let data = await catchError<DropDownListItem[]>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    return;
  }

  list = data[1];
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
  const { trainNumber } = Object.fromEntries(formData);
  if (trainNumber.toString().trim().length === 0) {
    toastState.error("Invalid train number");
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
            result.data.error.trainNumber ?? trainNumber.toString(),
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
  action="/trains"
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
      placeholder="Train number"
      bind:value={formInputValue}
      autocomplete="off"
      onfocus={searchable.onFocus}
      onkeyup={onInputChange}
    />
    <input
      type="hidden"
      name="trainNumber"
      value={selectedItem?.dataText ?? ""}
    >
    {#if form?.returnType === "Error" && form.error.trainNumber}
      <p class="text-error text-sm">
        {form.error.trainNumber}
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

{#if form?.returnType === "TrainInfo"}
  {@const trainInfo = form.data}
  <TrainInfo {trainInfo} />
{/if}
