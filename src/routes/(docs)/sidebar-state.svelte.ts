import { getContext, setContext } from "svelte";

export class SidebarState {
  isSidebarOpen = $state(false);

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}

const SIDEBAR_KEY = Symbol("SIDEBAR");

export function setSidebarState() {
  return setContext(SIDEBAR_KEY, new SidebarState());
}
export function getSidebarState() {
  return getContext<ReturnType<typeof setSidebarState>>(SIDEBAR_KEY);
}
