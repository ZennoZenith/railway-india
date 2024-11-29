<script lang="ts">
import Footer from "./footer.svelte";
import Header from "./header.svelte";
import "./prose.css";

let { children, data } = $props();
</script>

<div class="layout">
  <Header />

  <main class="">
    {@render children?.()}
  </main>

  <Footer />
</div>
