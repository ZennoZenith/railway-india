<script lang="ts">
import Schedule from "../Schedule.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<Schedule schedule={data.data} />
