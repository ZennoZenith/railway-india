<script lang="ts">
import "../app.css";
import Toaster from "$lib/components/Toaster.svelte";
import ToastTest from "$lib/components/ToastTest.svelte";
import { setToastState } from "$lib/toast-state.svelte";

let { children } = $props();
setToastState();
</script>

<ToastTest />

{@render children()}

<Toaster />
