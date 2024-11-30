<script lang="ts">
import { Separator } from "./ui/separator";
</script>

<nav class="sticky top-0 flex gap-2 border-b p-4 text-base bg-background z-50">
  <a
    href="/"
    class="text-muted-foreground hover:text-primary font-medium transition-colors"
  >
    Home
  </a>
  <Separator orientation="vertical" />
  <a
    href="/trains"
    class="text-muted-foreground hover:text-primary font-medium transition-colors"
  >
    Trains
  </a>
  <Separator orientation="vertical" />
  <a
    href="/schedules"
    class="text-muted-foreground hover:text-primary font-medium transition-colors"
  >
    Schedule
  </a>
  <Separator orientation="vertical" />
  <a
    href="/stations"
    class="text-muted-foreground hover:text-primary font-medium transition-colors"
  >
    Stations
  </a>
  <a
    href="/docs"
    class="text-muted-foreground hover:text-primary font-medium transition-colors ml-auto"
  >
    Docs
  </a>
</nav>
