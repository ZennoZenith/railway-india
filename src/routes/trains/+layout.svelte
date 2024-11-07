<script lang="ts">
import type { Snippet } from "svelte";
import type { LayoutData } from "./$types";

type Props = {
  data: LayoutData;
  children: Snippet;
};

let { children, data }: Props = $props();
</script>

<form action="" class="mx-auto flex mb-2 join max-w-max">
  <label class="form-control w-full">
    <input
      type="text"
      placeholder="Train number"
      class="input input-bordered w-full join-item"
      value={data?.slug}
    />
  </label>
  <button type="submit" class="btn btn-primary join-item">Search</button>
</form>

{@render children?.()}
