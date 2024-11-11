<script lang="ts">
import { applyAction, enhance } from "$app/forms";
import { invalidateAll } from "$app/navigation";
import { Button } from "$lib/components/ui/button/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { CreateSearchable } from "$lib/search.svelte";
import { getToastState } from "$lib/toast-state.svelte";
import type { DropDownListItem } from "$lib/types";
import type { ActionData, SubmitFunction } from "./$types";
import type { FormError } from "./+page.server";
import TrainInfo from "./TrainInfo.svelte";

type Props = {
  form: ActionData;
};

let { form }: Props = $props();
const toastState = getToastState();
const searchable = new CreateSearchable(100);
let selectedDropdownItem = $state<DropDownListItem>();
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
];
let filteredList = $state<DropDownListItem[]>(list);

function onInputChange(
  event: Event & { currentTarget: EventTarget & HTMLInputElement },
) {
  resetError("trainNumber");

  filteredList = list.filter((val) => {
    return val.text.toLowerCase().includes(
      event.currentTarget.value.trim().toLowerCase(),
    );
  });
}

function selectDropdownItem(key: DropDownListItem["key"] | undefined) {
  selectedDropdownItem = list.find((val) => val.key === key);
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
  class="flex"
  action="/trains"
  method="POST"
  use:enhance={submit}
>
  <div
    class="w-full max-w-sm relative"
    onfocusout={searchable.onFocusLoss}
  >
    <Input
      type="text"
      placeholder="Train number"
      name="trainNumber"
      value={selectedDropdownItem?.text ?? ""}
      autocomplete="off"
      onfocus={searchable.onFocus}
      oninput={onInputChange}
    />
    {#if form?.success === false && form.error.trainNumber}
      <p class="text-error text-sm">
        {form.error.trainNumber}
      </p>
    {/if}
    {#if searchable.showDropdown}
      <div class="absolute w-full -left-2 top-10 flex flex-col">
        {#each filteredList as item (item.key)}
          <Button
            variant="secondary"
            class="bg-secondary rounded-sm"
            data-key={item.key}
            data-data-text={item.dataText}
            onclick={(e) => {
              selectDropdownItem(e.currentTarget.dataset.key);
              searchable.closeDropdown();
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

{#if form?.success}
  {@const trainInfo = form.data}
  <TrainInfo {trainInfo} />
{/if}
