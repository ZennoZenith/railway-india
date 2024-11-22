import { catchError, handleApiResponseError, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { validateSchema } from "./schema";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<unknown>(request.json());

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

  const reqData = validateSchema(j[1]);
  if (!reqData.success) {
    return json(
      reqData satisfies Superposition,
      { status: reqData.httpCode },
    );
  }

  const { fromStation, toStation, allTrains, flexible, date } = reqData.data;
  const errorJson = await ApiClient.trainsBtwStations.getTrainsBtwStations(
    fromStation,
    toStation,
    {
      allTrains: allTrains === "true" ? true : false,
      flexible: flexible === "true" ? true : false,
      date,
    },
  );

  const handledResponse = handleApiResponseError(errorJson);

  return json(handledResponse, { status: handledResponse.success === false ? handledResponse.httpCode : 200 });
};
