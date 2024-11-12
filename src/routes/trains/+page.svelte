<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { catchError, Debounce } from "$lib";
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
const searchable = new CreateSearchable(100);
const debounce = new Debounce();
let selectedDropdownItem = $state<DropDownListItem>();
let filteredList = $state<DropDownListItem[]>([]);

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  resetError("trainNumber");
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

  filteredList = data[1];
}

function selectDropdownItem(key: DropDownListItem["key"] | undefined) {
  selectedDropdownItem = filteredList.find((val) => val.key === key);
  searchable.closeDropdown();
  formInputValue = selectedDropdownItem?.text ?? "";
  if (selectedDropdownItem?.dataText) {
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
  class="flex content-between"
  action="?/train"
  method="POST"
  use:enhance={submit}
>
  <div
    class="relative"
    onfocusout={searchable.onFocusLoss}
  >
    <Input
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
      value={selectedDropdownItem?.dataText ?? ""}
    >
    {#if form?.returnType === "Error" && form.error.trainNumber}
      <p class="text-error text-sm">
        {form.error.trainNumber}
      </p>
    {/if}
    {#if searchable.showDropdown}
      <div class="absolute w-full left top-10 flex flex-col">
        {#each filteredList as item (item.key)}
          <Button
            variant="secondary"
            class="bg-secondary rounded-sm px-5 overflow-hidden justify-start"
            data-key={item.key}
            data-data-text={item.dataText}
            onclick={(e) => {
              selectDropdownItem(e.currentTarget.dataset.key);
            }}
          >
            {item.text}
          </Button>
        {/each}
      </div>
    {/if}
  </div>
  <Button type="submit">Search</Button>
</form>

{#if form?.returnType === "TrainInfo"}
  {@const trainInfo = form.data}
  <TrainInfo {trainInfo} />
{/if}
