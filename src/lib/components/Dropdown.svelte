<script lang="ts">
import type { CreateSearchable } from "$lib/search.svelte";
import type { DropDownListItem } from "$lib/types";

type Props = {
  searchable: CreateSearchable;
  selectedItem?: DropDownListItem;
  onSelect?: (
    event?: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) => void;
  list: DropDownListItem[];
};

let {
  searchable,
  selectedItem: _selectedItem = $bindable(),
  onSelect = () => {},
  list,
}: Props = $props();

function selectDropdownItem(
  event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
) {
  const key: DropDownListItem["key"] | undefined =
    event.currentTarget.dataset.key;
  _selectedItem = list.find((val) => val.key === key);
  searchable.closeDropdown();
  onSelect(event);
}
</script>

{#if searchable.showDropdown}
  <div class="absolute w-full left top-10 flex flex-col z-10">
    {#each list as item (item.key)}
      <button
        class="bg-secondary rounded-sm px-3 overflow-hidden flex items-center hover:bg-zinc-700 h-10 whitespace-nowrap"
        type="button"
        data-key={item.key}
        data-data-text={item.dataText}
        onclick={selectDropdownItem}
      >
        {item.text}
      </button>
    {/each}
  </div>
{/if}
