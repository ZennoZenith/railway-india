<script lang="ts">
import type { DropDownListItem } from "$lib/types";

type Props = {
  id?: string;
  placeholder?: string;
  focusLossTimeMs?: number;
  wrapAroundIndex?: boolean;
  list: DropDownListItem[];
  selectedItemIndex: number;
  setFirstAsDefault?: boolean;
  class?: string;
  onSelect?: (selectedItemIndex: number) => void;
};

let {
  id = "Default id",
  placeholder = "Default placeholder",
  focusLossTimeMs = 50,
  wrapAroundIndex = true,
  setFirstAsDefault = false,
  list = [],
  class: className = "input input-bordered w-full h-12",
  selectedItemIndex = $bindable(-1),
  onSelect,
}: Props = $props();

const event = new CustomEvent("onselect");
let isDropdownOpen = $state(false);
let dropdownRef: HTMLDivElement;

let hoveredItemIndex: number = $state(-1);

if (list.length > 0 && setFirstAsDefault) {
  selectedItemIndex = 0;
  hoveredItemIndex = 0;
}

const handleDropdownFocus = () => {
  if (list.length === 0) {
    return;
  }

  isDropdownOpen = true; // togle state on click

  if (hoveredItemIndex === -1) {
    hoveredItemIndex = 0;
  }

  if (list.length > hoveredItemIndex) {
    const optionsList = dropdownRef.children;
    (optionsList[hoveredItemIndex] as HTMLElement).focus();
  }
};

const handleDropdownFocusLoss = (
  event: FocusEvent & {
    currentTarget: EventTarget & HTMLDivElement;
  },
) => {
  const { relatedTarget, currentTarget } = event;
  if (
    relatedTarget instanceof HTMLElement
    && currentTarget.contains(relatedTarget)
  ) return;

  setTimeout(() => {
    isDropdownOpen = false;
  }, focusLossTimeMs);
};

function onClickDropdown(
  event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
) {
  const key = event.currentTarget.dataset.key;
  setTimeout(() => {
    selectItem(key);
    isDropdownOpen = false;
  }, focusLossTimeMs);
}

function keyboardKeyHandler(
  event: KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement },
) {
  if (list.length === 0) {
    return;
  }

  const optionsList = dropdownRef.children;
  let index = hoveredItemIndex;
  if (event.code === "ArrowDown" || event.code === "ArrowRight") {
    if (index === -1) {
      return;
    }

    if (index === list.length - 1 && !wrapAroundIndex) {
      return;
    }
    // selectedItemIndex = (index + 1) % list.length;
    index = (index + 1) % list.length;
  } else if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
    if (index === -1) {
      return;
    }

    if (index === 0 && !wrapAroundIndex) {
      return;
    }

    index--;
    if (index < 0) {
      index = list.length - 1;
    }
  } else {
    return;
  }
  hoveredItemIndex = index;
  const item = list[hoveredItemIndex];
  for (const ele of optionsList) {
    let d = ele as HTMLElement;
    if (d?.dataset?.key === item.key) {
      d.focus();
    }
  }
}

function selectItem(item?: string) {
  selectedItemIndex = list.findIndex((val) => val.key === item);
  hoveredItemIndex = selectedItemIndex;
  onSelect?.(selectedItemIndex);
}
</script>

<div onfocusout={handleDropdownFocusLoss} class="w-64">
  <input
    type="text"
    {id}
    class={className}
    {placeholder}
    onfocus={handleDropdownFocus}
    value={list[selectedItemIndex]?.text || ""}
  >

  <div class="relative">
    <div
      bind:this={dropdownRef}
      class="absolute z-10 bg-neutral left-0 top-0 w-full"
      style:visibility={isDropdownOpen ? "visible" : "hidden"}
    >
      {#each list as item (item.key)}
        <button
          class="btn rounded-none text-neutral-content w-full h-12"
          onclick={onClickDropdown}
          onkeydown={keyboardKeyHandler}
          data-key={item.key}
          data-data-text={item.dataText}
        >
          {item.text}
        </button>
      {/each}
    </div>
  </div>
</div>
