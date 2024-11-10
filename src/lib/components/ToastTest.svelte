<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { getToastState } from "$lib/toast-state.svelte";
import type { ToastType } from "$lib/types";

const toastState = getToastState();

function showToast(toastType: ToastType): any {
  switch (toastType) {
    case "INFO":
      toastState.info("Info Message", "Info title");
      break;
    case "SUCCESS":
      toastState.success("Success Message", "Success title");
      break;
    case "WARNING":
      toastState.warning("Warning Message", "Warning title");
      break;
    case "ERROR":
      toastState.error("Error Message", "Error title");
      break;
  }
}
</script>

<div class="flex flex-wrap gap-4 p-4">
  <Button
    class="bg-info text-info-foreground"
    type="button"
    onclick={() => showToast("INFO")}
  >
    Add Info Toast
  </Button>
  <Button
    class="bg-success text-success-foreground"
    type="button"
    onclick={() => showToast("SUCCESS")}
  >
    Add Success Toast
  </Button>
  <Button
    class="bg-warning text-warning-foreground"
    type="button"
    onclick={() => showToast("WARNING")}
  >
    Add Warning Toast
  </Button>
  <Button
    class="bg-error text-error-foreground"
    type="button"
    onclick={() => showToast("ERROR")}
  >
    Add error Toast
  </Button>
</div>
