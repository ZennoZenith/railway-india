<script lang="ts">
import TrainInfo from "../TrainInfo.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<TrainInfo trainInfo={data.data} />
