<script lang="ts">
import { cn } from "$lib/utils";
// import { Check, Minus } from "svelte-radix";
import { Checked, Indeterminate } from "$lib/svgs";

type Props = {
  ref?: HTMLElement | null;
  id?: string | null;
  checked?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  class?: string | null;
  onclick?: (
    e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) => void;
  onCheckedChange?: (v: boolean) => void;
  onIndeterminateChange?: (v: boolean) => void;
  [key: string]: any;
};

let {
  id,
  ref = $bindable(null),
  class: className,
  required = false,
  checked = $bindable(false),
  indeterminate = $bindable(false),
  onclick = () => {},
  onCheckedChange = () => {},
  onIndeterminateChange = () => {},
  ...restProps
}: Props = $props();

let checkedState = $derived.by(() => {
  if (checked) {
    return "checked";
  } else if (indeterminate) {
    return "indeterminate";
  }
  return "unchecked";
});
</script>

<button
  onclick={e => {
    checked = !checked;
    onclick(e);
    onCheckedChange(checked);
  }}
  bind:this={ref}
  class={cn(
    "border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
    className,
  )}
  data-id="1A"
  {id}
  role="checkbox"
  type="button"
  aria-checked={checked}
  aria-required={required}
  data-state={checkedState}
  data-checkbox-root=""
  {...restProps}
>
  <span class="flex items-center justify-center text-current">
    {#if indeterminate}
      <Indeterminate />
    {:else}
      <Checked class={checked ? "" : "text-transparent"} />
    {/if}
  </span>
</button>
