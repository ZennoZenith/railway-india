<script lang="ts">
import { cn } from "$lib/utils";
let {
  class: className,
}: {
  class?: string | null;
} = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class={cn("size-4", className)}
  role="img"
  width="24"
  height="24"
  fill="currentColor"
  aria-label="minus"
  viewBox="0 0 15 15"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
  >
  </path>
</svg>
