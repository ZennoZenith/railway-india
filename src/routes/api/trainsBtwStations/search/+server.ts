import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { error, json } from "@sveltejs/kit";
import type { ApiError, TrainsBetweenStations } from "api-railway/dist/types";
import type { RequestHandler } from "./$types";
import { validateSchema, type ValidationError } from "./schema";

export type Return = {
  success: false;
  error:
    & ({
      httpCode: number;
    })
    & (
      | {
        type: "VALIDATION";
      } & ValidationError
      | {
        type: "API";
        message: string;
      }
    );
} | {
  success: true;
  data: TrainsBetweenStations;
};

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<unknown>(request.json());

  if (j[0]) {
    error(
      400,
      JSON.stringify(
        { success: false, error: { httpCode: 400, type: "API", message: "Invalid JSON" } } satisfies Return,
      ),
    );
  }

  let reqData = validateSchema(j[1]);

  if (reqData[0]) {
    error(
      400,
      JSON.stringify({ success: false, error: { httpCode: 400, type: "VALIDATION", ...reqData[0] } } satisfies Return),
    );
  }

  const { fromStation, toStation, allTrains, date, flexible } = reqData[1];

  const { url, method, headers, returnType } = ApiClient.trainsBtwStations.getTrainsBtwStations(
    fromStation,
    toStation,
    {
      allTrains: allTrains === "true" ? true : false,
      flexible: flexible === "true" ? true : false,
      date,
    },
  );

  let response = await catchError(fetch(url, {
    headers,
    method,
  }));

  if (response[0]) {
    console.error(response[0]);
    error(
      500,
      JSON.stringify(
        { success: false, error: { httpCode: 400, type: "API", message: "Unable to fetch" } } satisfies Return,
      ),
    );
  }

  let data = await catchError<typeof returnType | ApiError>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    error(
      500,
      JSON.stringify(
        { success: false, error: { httpCode: 400, type: "API", message: "Fetch returned non JSON" } } satisfies Return,
      ),
    );
  }

  if (response[1].status > 299) {
    let err = data[1] as ApiError;
    error(
      err.httpCode,
      JSON.stringify(
        { success: false, error: { httpCode: err.httpCode, type: "API", message: err.error } } satisfies Return,
      ),
    );
  }

  return json({ success: true, data: data[1] as TrainsBetweenStations } satisfies Return);
};
