<script lang="ts">
import { fetchJson, type Superposition } from "$lib";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import type { ScheduleRow } from "api-railway/dist/types";
import Schedule from "./schedules/Schedule.svelte";

let { trainNumber }: { trainNumber: string } = $props();

let schedule = $state<Superposition<{}, ScheduleRow[]>>();
async function onOpen() {
  const errorJson = await fetchJson<Superposition<{}, ScheduleRow[]>>(
    `/api/schedules/${trainNumber}`,
    {
      method: "GET",
    },
  );

  if (!errorJson.success) {
    console.error(errorJson.error);
    return;
  }
  schedule = errorJson.data;
}
</script>

<Dialog.Root
  onOpenChange={(open) => {
    if (open) {
      onOpen();
    }
  }}
>
  <Dialog.Trigger class="underline" {onclick}>
    Schedule
  </Dialog.Trigger>
  <Dialog.Content class="max-w-[90vw] max-h-[90vh]">
    {#if schedule?.success}
      <div class="max-w-[85vw] max-h-[85vh] overflow-auto">
        <Schedule schedule={schedule.data} />
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
