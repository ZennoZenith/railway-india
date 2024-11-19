<script lang="ts">
import { Checkbox } from "$lib/components/ui/checkbox";
import { Label } from "$lib/components/ui/label";
import { ComponentBoolean } from "svelte-radix";

type Props = {
  id: string;
  data: string;
  checked?: boolean;
  text: string;
  color?: string;
};

let {
  id,
  data,
  checked = $bindable(true),
  text,
  color,
}: Props = $props();
</script>

<div class="flex items-center gap-2">
  <Checkbox {id} data-id={data} bind:checked />
  <Label
    for={id}
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-nowrap overflow-clip"
  >
    {#if color}
      <span> <ComponentBoolean {color} class="inline" /> </span>
    {/if}
    {text}
  </Label>
</div>
