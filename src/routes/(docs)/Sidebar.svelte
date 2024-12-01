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

<aside class:open={sidebarState.isSidebarOpen}>
  <div
    id="aside-main"
    class="relative bg-background flex flex-col gap-4 px-4"
  >
    <div class="sticky w-full top-0 left-0 grid gap-4 pt-4 bg-background h-min">
      <div class="flex justify-between">
        {sidebar.title}
        <button
          id="sidebar-close-btn"
          type="button"
          aria-label="Close"
          onclick={() => sidebarState.closeSidebar()}
        >
          <Cross1 />
        </button>
      </div>
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
  </div>
  <div
    tabindex="0"
    id="aside-other"
    class:aside-other-open={sidebarState.isSidebarOpen}
    onclick={() => sidebarState.closeSidebar()}
    onkeydown={() => sidebarState.closeSidebar()}
    role="button"
  >
  </div>
</aside>

<style>
aside {
  display: grid;
  position: sticky;
  left: 0;
  top: 0;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  overflow: auto;
  height: calc(100dvh - var(--navbar-height));
  transition: all 250ms;
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

#aside-other {
  display: none;
}

@media (max-width: 960px) {
  aside {
    --floating-sidebar-width: min(320px, 90dvw);
    z-index: 99;
    overflow: hidden;
    position: fixed;
    left: calc(0px - var(--floating-sidebar-width));
    top: var(--navbar-height);
    max-width: calc(100dvw);
    height: calc(100dvh - var(--navbar-height));
    grid-template-columns: var(--floating-sidebar-width) auto;
  }

  #aside-main {
    overflow: auto;
  }

  .open {
    left: 0;
  }

  .aside-other-open {
    display: block !important;
    width: calc(100dvw - var(--floating-sidebar-width));
  }

  #sidebar-close-btn {
    display: block;
  }
}
</style>
