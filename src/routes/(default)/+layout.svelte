<script lang="ts">
import "../../app.css";
let { children } = $props();
</script>

<main class="max-w-[960px] p-4 mx-auto">
  {@render children()}
</main>
