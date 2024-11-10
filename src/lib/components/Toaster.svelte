<script lang="ts">
import Toast from "$lib/components/Toast.svelte";
import { getToastState } from "$lib/toast-state.svelte";

const toastState = getToastState();
</script>

<div id="toast-container" class="absolute flex flex-col gap-2 bottom-2 right-2">
  {#each toastState.toasts as toast (toast.id)}
    <Toast {toast} />
  {/each}
</div>

<style>
</style>
