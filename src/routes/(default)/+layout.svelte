<script lang="ts">
import "../../app.css";
import Navbar from "$lib/components/Navbar.svelte";
import Toaster from "$lib/components/Toaster.svelte";
import { setToastState } from "$lib/toast-state.svelte";

let { children } = $props();
setToastState();
</script>

<Navbar />

<!-- 
import ToastTest from "$lib/components/ToastTest.svelte";
<ToastTest />
 -->

<main class="max-w-[960px] p-4 mx-auto">
  {@render children()}
</main>

<Toaster />
