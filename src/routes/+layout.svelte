<script lang="ts">
import Navbar from "$lib/components/Navbar.svelte";
import Toaster from "$lib/components/Toaster.svelte";
import { setToastState } from "$lib/toast-state.svelte";

let { children } = $props();
setToastState();
</script>

<!-- 
import ToastTest from "$lib/components/ToastTest.svelte";
<ToastTest />
 -->

<div id="main-layout">
  <Navbar />
  <div id="other-content">
    {@render children()}
  </div>
</div>

<Toaster />

<style>
:global(html) {
  --navbar-height: 56px;
}

#main-layout {
  display: grid;
  grid-template-rows: var(--navbar-height) 1fr;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
}
#other-content {
  overflow-y: auto;
}
</style>
