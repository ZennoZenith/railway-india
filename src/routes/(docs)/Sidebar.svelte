<script lang="ts">
import { Separator } from "$lib/components/ui/separator";
import type { Aside } from "$lib/types";
import { Cross1 } from "svelte-radix";
import { getSidebarState } from "./sidebar-state.svelte";

const sidebarState = getSidebarState();
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

<aside
  class="bg-background relative"
  class:sidebar-open={sidebarState.isSidebarOpen}
>
  <div class="sticky w-full top-0 left-0 grid gap-4 pt-8 bg-background">
    <div>{sidebar.title}</div>
    <Separator />
    <button
      id="sidebar-close-btn"
      type="button"
      class="absolute right-0 top-3"
      aria-label="Close"
      onclick={sidebarState.toggleSidebar}
    >
      <Cross1 />
    </button>
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

<style>
aside {
  padding: 0 16px 0 32px;
  display: grid;
  position: sticky;
  left: 0;
  top: 0;
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

#sidebar-close-btn {
  display: none;
}

@media (max-width: 960px) {
  aside {
    z-index: 99;
    position: fixed;
    top: 0;
    left: -320px;
    width: 320px;
    height: 100dvh;

    transition: transform 250ms;
  }

  .sidebar-open {
    transform: translateY(320px);
  }

  #sidebar-close-btn {
    display: block;
  }
}
</style>
