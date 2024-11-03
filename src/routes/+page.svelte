<script lang="ts">
import Swap from "$lib/components/swap-vertical-svgrepo-com.svelte";
function func(e: any) {
  console.log(e);
}
</script>

<form action="" class="flex flex-col gap-2">
  <label class="form-control w-full">
    <!-- 
    <div class="label">
      <span class="label-text"> From: </span>
    </div>
     -->
    <input
      type="text"
      placeholder="From station"
      class="input input-bordered w-full"
    />
  </label>
  <button class="-my-1 w-4 mx-auto" type="button">
    <Swap />
  </button>
  <label class="form-control w-full">
    <!-- 
    <div class="label">
      <span class="label-text"> To: </span>
    </div>
     -->
    <input
      type="text"
      placeholder="To station"
      class="input input-bordered w-full"
      value="hello"
      onchange={func}
    />
  </label>

  <label class="form-control">
    <div class="label">
      <span class="label-text"> Date: </span>
    </div>
    <input
      type="date"
      class="input input-bordered w-full"
    />
  </label>
  <section id="filters">
    <div class="">
      <input
        id="flexible-with-date"
        type="checkbox"
        class=""
      />
      <label class="" for="flexible-with-date">
        Flexible with date
      </label>
    </div>
  </section>
  <button type="submit" class="btn btn-primary">Search</button>
</form>

<style>
</style>
