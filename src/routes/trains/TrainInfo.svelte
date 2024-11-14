<script lang="ts">
import { DurationSecToHM, trainRunsOnUtil } from "$lib";
import * as Table from "$lib/components/ui/table/index.js";
import type { TrainInfo } from "api-railway/dist/types";

const { trainInfo }: { trainInfo: TrainInfo } = $props();
</script>

<Table.Root class="mt-2">
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">Train number</Table.Cell>
      <Table.Cell>{trainInfo.trainNumber}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Train Name</Table.Cell>
      <Table.Cell>{trainInfo.trainName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Train Full Name</Table.Cell>
      <Table.Cell>{trainInfo.trainFullName}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Train Runs On</Table.Cell>
      <Table.Cell class="flex gap-2">
        {#each trainRunsOnUtil(trainInfo.trainRunningDays) as day}
          {#if day.state}
            <span class="text-green-400">
              {day.text}
            </span>
          {:else}
            <span class="text-red-400">
              {day.text}
            </span>
          {/if}
        {/each}
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Available Classes</Table.Cell>
      <Table.Cell>{trainInfo.availableClasses.join(", ")}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Pantry</Table.Cell>
      <Table.Cell>{trainInfo.hasPantry ? "Yes" : "No"}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Train Type</Table.Cell>
      <Table.Cell>{trainInfo.trainTypeCode}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Station From</Table.Cell>
      <Table.Cell>
        <a href={`/stations/${trainInfo.stationFrom.stationCode}`}>
          {trainInfo.stationFrom.stationName}
          ({trainInfo.stationFrom.stationCode})
        </a>
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Departure Time</Table.Cell>
      <Table.Cell>{trainInfo.departureTime.slice(0, 5)}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Station To</Table.Cell>
      <Table.Cell>
        <a href={`/stations/${trainInfo.stationTo.stationCode}`}>
          {trainInfo.stationTo.stationName}
          ({trainInfo.stationTo.stationCode})
        </a>
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Arrival Time</Table.Cell>
      <Table.Cell>{trainInfo.arrivalTime.slice(0, 5)}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Duration</Table.Cell>
      <Table.Cell>{DurationSecToHM(trainInfo.durationSec)}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Distance</Table.Cell>
      <Table.Cell>{trainInfo.distance} km</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Avrage Speed</Table.Cell>
      <Table.Cell>{trainInfo.avgSpeed} km/h</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Number of stops</Table.Cell>
      <Table.Cell>{trainInfo.numberOfStops}</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Return Train number</Table.Cell>
      <Table.Cell>{trainInfo.returnTrainNumber}</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
