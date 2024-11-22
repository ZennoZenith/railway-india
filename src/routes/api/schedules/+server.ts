import { catchError, handleApiResponseError, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<{ trainNumber?: string }>(request.json());

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

  const { trainNumber } = j[1];

  if (!trainNumber) {
    return json(
      {
        success: false,
        httpCode: 400,
        error: {
          type: "VALIDATION",
          messages: ["Validation error"],
          data: { trainNumber: ["train number not provided"] },
        },
      } satisfies Superposition<{ trainNumber: [string] }>,
      { status: 400 },
    );
  }
  const errorJson = await ApiClient.schedules.getSchedule(trainNumber.toString());

  const handledResponse = handleApiResponseError(errorJson);

  return json(handledResponse, { status: handledResponse.success === false ? handledResponse.httpCode : 200 });
};
