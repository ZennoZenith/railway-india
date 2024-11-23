<script lang="ts">
import { Checkbox } from "$lib/components/ui/checkbox";
// import Checkbox from "$lib/components/Checkbox.svelte";
import { Label } from "$lib/components/ui/label";
import { ComponentBoolean } from "svelte-radix";

type Props = {
  id: string;
  data: string;
  checked?: boolean;
  text: string;
  color?: string;
  onCheckedChange?: (value: boolean) => void;
};

let {
  id,
  data,
  checked = true,
  text,
  color,
  onCheckedChange,
}: Props = $props();
</script>

<div class="flex items-center gap-2">
  <Checkbox
    {id}
    data-id={data}
    {checked}
    {onCheckedChange}
  />
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
