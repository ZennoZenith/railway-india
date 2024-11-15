<script lang="ts">
import * as Table from "$lib/components/ui/table/index.js";
import type { StationInfo } from "api-railway/dist/types";

const { station }: { station: StationInfo } = $props();
</script>

<section class="grid grid-cols-2 mx-auto w-max"></section>
<Table.Root class="mt-2">
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">Station Code</Table.Cell>
      <Table.Cell>{station.stationCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Station Name</Table.Cell>
      <Table.Cell>{station.stateName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">State</Table.Cell>
      <Table.Cell>{station.stateName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Zone</Table.Cell>
      <Table.Cell>{station.zoneCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Station alternate name</Table.Cell>
      <Table.Cell>{station.stationAlternateText}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Type</Table.Cell>
      <Table.Cell>{station.stationType}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Number of platforms</Table.Cell>
      <Table.Cell>{station.numberOfPlatforms}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Hindi station name</Table.Cell>
      <Table.Cell>{station.hindiStationName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Latitude</Table.Cell>
      <Table.Cell>{station.latitude}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Longitude</Table.Cell>
      <Table.Cell>{station.longitude}</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
