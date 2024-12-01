<script lang="ts">
import { setSidebarState } from "./sidebar-state.svelte";
import Sidebar from "./Sidebar.svelte";
import "../../app.css";
import "./prose.css";

let { children } = $props();
setSidebarState();
</script>

<div class="layout">
  <Sidebar />
  <main>
    <article class="prose">
      <div>
        {@render children?.()}
      </div>
    </article>
  </main>
</div>

<style>
.layout {
  display: grid;
  grid-template-columns: 272px auto;
}

main {
  overflow-y: auto;
  overflow-x: hidden;
  text-wrap: balance;
  padding: 1rem;
}

@media (max-width: 960px) {
  .layout {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
