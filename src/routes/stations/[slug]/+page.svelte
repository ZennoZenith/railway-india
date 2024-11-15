<script lang="ts">
import StationInfo from "../StationInfo.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<StationInfo station={data.data} />
