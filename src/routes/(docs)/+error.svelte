<script lang="ts">
import { page } from "$app/stores";
</script>

<h1>Error</h1>
<p>{$page.status}:</p>
<pre> {$page.error?.message} </pre>
