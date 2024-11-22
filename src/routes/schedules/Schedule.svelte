<script lang="ts">
import * as Table from "$lib/components/ui/table/index.js";
import type { ScheduleRow } from "api-railway/dist/schedules";

const { schedule }: { schedule: ScheduleRow[] } = $props();
</script>

<Table.Root class="">
  <Table.Header>
    <Table.Row>
      <Table.Head>Sr No.</Table.Head>
      <Table.Head>Station</Table.Head>
      <Table.Head>Day</Table.Head>
      <Table.Head>
        Arrival Time
      </Table.Head>
      <Table.Head>
        Departure Time
      </Table.Head>
      <Table.Head>
        Halt Time
      </Table.Head>
      <Table.Head>Speed</Table.Head>
      <Table.Head>
        Platform
      </Table.Head>
      <Table.Head>
        Distance (km)
      </Table.Head>
      <Table.Head>Avg. Speed (km/h)</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body class="h-full">
    {#each schedule as row}
      <Table.Row>
        <Table.Cell>{row.srNo.split(".")[0]}</Table.Cell>
        <Table.Cell>
          <a href={`/stations/${row.station.stationCode}`} target="_blank">
            {row.station.stationCode}
          </a>
        </Table.Cell>
        <Table.Cell>{row.dayCount}</Table.Cell>
        <Table.Cell>
          {row.arrivalTime?.slice(0, 5)}
        </Table.Cell>
        <Table.Cell>
          {row.departureTime?.slice(0, 5)}
        </Table.Cell>
        <Table.Cell>
          {row.haltTime?.slice(0, 5)}
        </Table.Cell>
        <Table.Cell>{row.speed}</Table.Cell>
        <Table.Cell>{row.platform}</Table.Cell>
        <Table.Cell>{row.distance}</Table.Cell>
        <Table.Cell>{row.speed}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
