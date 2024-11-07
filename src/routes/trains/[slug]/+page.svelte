<script lang="ts">
import type { PageData } from "./$types";

type Props = {
  data: PageData;
};

const { data }: Props = $props();
</script>

{JSON.stringify(data)}
