import { catchError, handleApiResponseError, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<{ stationCode?: string }>(request.json());

  if (j[0]) {
    return json(
      {
        success: false,
        httpCode: 400,
        error: { type: "GENERIC", messages: ["Invalid JSON"] },
      } satisfies Superposition,
      { status: 400 },
    );
  }

  const { stationCode } = j[1];

  if (!stationCode) {
    return json(
      {
        success: false,
        httpCode: 400,
        error: {
          type: "VALIDATION",
          messages: ["Validation error"],
          data: { stationCode: ["station code not provided"] },
        },
      } satisfies Superposition<{ stationCode: [string] }>,
      { status: 400 },
    );
  }
  const errorJson = await ApiClient.stations.getStation(stationCode.toString());

  const handledResponse = handleApiResponseError(errorJson);

  return json(handledResponse, { status: handledResponse.success === false ? handledResponse.httpCode : 200 });
};
