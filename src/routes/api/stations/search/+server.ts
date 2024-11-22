import { catchError, handleApiResponseError, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<{ q?: string }>(request.json());

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

  const { q } = j[1];

  if (!q) {
    return json(
      {
        success: false,
        httpCode: 400,
        error: { type: "VALIDATION", messages: ["Validation error"], data: { q: ["q not provided"] } },
      } satisfies Superposition<{ q: [string] }>,
      { status: 400 },
    );
  }

  const errorJson = await ApiClient.stations.getStationsLikeQuery(q);

  const handledResponse = handleApiResponseError(errorJson);

  return json(handledResponse, { status: handledResponse.success === false ? handledResponse.httpCode : 200 });
};
