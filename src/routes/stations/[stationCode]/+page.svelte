<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>
<section class="grid grid-cols-2 mx-auto w-max">
  <div>Station Code</div>
  <div>{data.stationCode}</div>
  <div>Station Name</div>
  <div>{data.stateName}</div>
  <div>State</div>
  <div>{data.stateName}</div>
  <div>Zone</div>
  <div>{data.zoneCode}</div>
  <div>Station alternate name</div>
  <div>{data.stationAlternateText}</div>
  <div>Type</div>
  <div>{data.stationType}</div>
  <div>Number of platforms</div>
  <div>{data.numberOfPlatforms}</div>
  <div>Hindi station name</div>
  <div>{data.hindiStationName}</div>
  <div>Latitude</div>
  <div>{data.latitude}</div>
  <div>Longitude</div>
  <div>{data.longitude}</div>
</section>
