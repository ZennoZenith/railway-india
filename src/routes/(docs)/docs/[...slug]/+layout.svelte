<script lang="ts">
import { Separator } from "$lib/components/ui/separator";
import { untrack } from "svelte";
import { CaretRight, TextAlignLeft } from "svelte-radix";
import { getSidebarState } from "../../sidebar-state.svelte";
let { data, children } = $props();
const sidebarState = getSidebarState();
let onThisPageOpen = $state(false);

// On layout load close sidebar
$effect(() => {
  data;
  untrack(() => {
    sidebarState.closeSidebar();
  });
});
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<div class="p-4 grid grid-cols-1">
  <div>
    <div class="flex justify-between pb-4">
      <button
        type="button"
        class="inline-flex items-center gap-1"
        onclick={() => sidebarState.openSidebar()}
      >
        <TextAlignLeft /> Menu
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1"
        onclick={() => onThisPageOpen = !onThisPageOpen}
      >
        On this page <CaretRight />
      </button>
    </div>
    <Separator />
  </div>

  <article class="mt-10">
    <hgroup>
      <h1>{data.meta.title}</h1>
      <!--  <p>Published at {formatDate(data.meta.date)}</p> -->
    </hgroup>
    {@render children?.()}
  </article>
</div>
