<script lang="ts">
import "../app.css";
import Navbar from "$lib/components/Navbar.svelte";
import Toaster from "$lib/components/Toaster.svelte";
import ToastTest from "$lib/components/ToastTest.svelte";
import { setToastState } from "$lib/toast-state.svelte";

let { children } = $props();
setToastState();
</script>

<Navbar />

<ToastTest />

{@render children()}

<Toaster />
