<script lang="ts">
import { Separator } from "$lib/components/ui/separator";
import type { Snippet } from "svelte";
import "../../app.css";
import "./prose.css";

let { title, children }: { title: string; children: Snippet } = $props();

type Links = {
  text: string;
  link?: string;
  items?: Links[];
};
type Aside = {
  title: string;
  links: Links[];
};
const sidebar: Aside = {
  title: "Railway API Docs",
  links: [
    { text: "Introduction", link: "/docs/introduction" },
    { text: "Authentication", link: "/docs/authentication" },
    { text: "Error Codes", link: "/docs/errorcodes" },
    { text: "Response Codes", link: "/docs/responsecodes" },
    { text: "Versioning", link: "/docs/versioning" },
    { text: "Rate Limiting", link: "/docs/rate-limiting" },
    {
      text: "Operations",
      link: "/docsoperations",
      items: [
        { text: "GET /stations", link: "/docs/operations/station-list" },
        {
          text: "GET /stations/{stationCode}",
          link: "/docs/operations/station-info",
        },
        { text: "GET /trains", link: "/docs/operations/train-list" },
        {
          text: "GET /trains/{trainNumber}",
          link: "/docs/operations/train-info",
        },
        {
          text: "GET /schedules/{trainNumber}",
          link: "/docs/operations/schedule",
        },
        {
          text: "GET /trainsBtwStations",
          link: "/docs/operations/trains-between-stations",
        },
        { text: "Misc. routes", link: "/docs/operations/misc" },
      ],
    },
    {
      text: "Api Wrappers",
      "link": "/docs/wrappers",
      items: [
        { text: "NodeJS", link: "/docs/wrappers/nodejs" },
      ],
    },
  ],
};
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
</svelte:head>

<div class="layout">
  <aside class="bg-background">
    <div class="sticky w-full top-0 left-0 grid gap-4 pt-8 bg-background">
      <div>{sidebar.title}</div>
      <Separator />
    </div>
    <div class="grid grid-cols-1 gap-3 pb-4">
      {#each sidebar.links as link}
        {#if link.items !== undefined}
          <div>
            <Separator />
          </div>
        {/if}
        <div><a href={link.link}> {link.text} </a></div>
        {#if link.items !== undefined}
          {#each link.items as item}
            <div><a href={item.link}> {item.text} </a></div>
          {/each}
        {/if}
      {/each}
    </div>
  </aside>
  <main>
    <article class="prose">
      <hgroup>
        <h1>{title}</h1>
      </hgroup>
      <div>
        {@render children?.()}
      </div>
    </article>
  </main>
</div>

<style>
.layout {
  position: relative;
  display: grid;
  grid-template-columns: 272px auto;
}

aside {
  padding: 0 16px 0 32px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  overflow: auto;
  height: calc(100dvh - var(--navbar-height));
}

aside::-webkit-scrollbar {
  width: 7px;
}

aside::-webkit-scrollbar-track {
  background-color: darkgrey;
}

aside::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

main {
  overflow-y: scroll;
  overflow-x: hidden;
  text-wrap: balance;
  padding: 1rem;
}

@media (max-width: 960px) {
  .layout {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
  }

  aside {
    position: fixed;
    width: 320px;
  }
}
</style>
