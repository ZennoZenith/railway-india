<script lang="ts">
type Props = {
  id?: string;
  placeholder?: string;
  focusLossTimeMs?: number;
  wrapAroundIndex?: boolean;
};

const {
  id = "Default id",
  placeholder = "Default placeholder",
  focusLossTimeMs = 50,
  wrapAroundIndex = true,
}: Props = $props();

let isDropdownOpen = $state(false);
let dropdownRef: HTMLDivElement;

const lists = [
  { key: "1", text: "Opt 1" },
  { key: "2", text: "Opt 2" },
  { key: "3", text: "Opt 3" },
  { key: "4", text: "Opt 4" },
  { key: "5", text: "Opt 5" },
] satisfies { key: string; text: string }[];

let selectedItemIndex: number = $state(-1);

if (lists.length > 0) {
  selectedItemIndex = 0;
}

const handleDropdownFocus = () => {
  isDropdownOpen = true; // togle state on click
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
  if (lists.length === 0 || selectedItemIndex === -1) {
    return;
  }

  const optionsList = dropdownRef.children;
  let index = selectedItemIndex;
  if (event.code === "ArrowDown" || event.code === "ArrowRight") {
    index = selectedItemIndex;
    if (index === -1) {
      return;
    }

    if (index === lists.length - 1 && !wrapAroundIndex) {
      return;
    }
    selectedItemIndex = (index + 1) % lists.length;
  } else if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
    let index = selectedItemIndex;
    if (index === -1) {
      return;
    }

    if (index === 0 && !wrapAroundIndex) {
      return;
    }

    index--;
    if (index < 0) {
      index = lists.length - 1;
    }
    selectedItemIndex = index;
  } else {
    return;
  }
  const item = lists[selectedItemIndex];
  for (const ele of optionsList) {
    let d = ele as HTMLElement;
    if (d?.dataset?.key === item.key) {
      d.focus();
    }
  }
}

function selectItem(item?: string) {
  selectedItemIndex = lists.findIndex((val) => val.key === item);
}
</script>

<div onfocusout={handleDropdownFocusLoss} class="w-64 relative">
  <input
    type="text"
    {id}
    class="input input-bordered w-full h-12"
    {placeholder}
    onfocus={handleDropdownFocus}
    value={lists[selectedItemIndex].text ?? ""}
  >

  <div
    bind:this={dropdownRef}
    class="absolute z-10 bg-neutral left-0 top-12 w-full"
    style:visibility={isDropdownOpen ? "visible" : "hidden"}
  >
    {#each lists as item (item.key)}
      <button
        class="btn rounded-none text-neutral-content w-full h-12"
        onclick={onClickDropdown}
        onkeydown={keyboardKeyHandler}
        data-key={item.key}
        data-options={item.text}
      >
        {item.text}
      </button>
    {/each}
  </div>
</div>
