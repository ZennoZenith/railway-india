<script lang="ts">
import { page } from "$app/stores";
</script>

<p>Error</p>
<h1>{$page.status}: {$page.error?.message}</h1>
