<script lang="ts">
// import { formatDate } from "$lib/utils";

let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
  <hgroup>
    <h1>{data.meta.title}</h1>
  </hgroup>

  <div class="prose">
    <data.content />
  </div>
</article>
