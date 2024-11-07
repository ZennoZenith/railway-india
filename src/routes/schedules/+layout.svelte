<script lang="ts">
let { children } = $props();
</script>

<form action="" class="mx-auto flex mb-2 join max-w-max">
  <label class="form-control w-full">
    <input
      type="text"
      placeholder="Train number"
      class="input input-bordered w-full join-item"
    />
  </label>
  <button type="submit" class="btn btn-primary join-item">Search</button>
</form>

{@render children?.()}
