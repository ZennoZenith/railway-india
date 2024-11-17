import { catchError, fetchJson, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { error, json } from "@sveltejs/kit";
import type { ApiError } from "api-railway/dist/types";
import type { RequestHandler } from "./$types";
import { validateSchema } from "./schema";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<unknown>(request.json());

  if (j[0]) {
    error(
      500,
      JSON.stringify(
        {
          success: false,
          httpCode: 400,
          error: { type: "GENERIC", messages: ["Invalid JSON"] },
        } satisfies Superposition,
      ),
    );
  }

  let reqData = validateSchema(j[1]);
  if (!reqData.success) {
    error(
      reqData.httpCode,
      JSON.stringify(reqData),
    );
  }

  const { fromStation, toStation, allTrains, flexible, date } = reqData.data;
  const { url, method, headers, returnType } = ApiClient.trainsBtwStations.getTrainsBtwStations(
    fromStation,
    toStation,
    {
      allTrains: allTrains === "true" ? true : false,
      flexible: flexible === "true" ? true : false,
      date,
    },
  );

  const reqJson = await fetchJson<typeof returnType | ApiError>(url, { headers, method });

  if (!reqJson.success) {
    console.error(reqJson.error.messages[0]);
    error(
      reqJson.httpCode,
      JSON.stringify(reqJson),
    );
  }

  if ("error" in reqJson.data) {
    error(
      reqJson.data.httpCode,
      JSON.stringify(
        {
          success: false,
          httpCode: reqJson.data.httpCode,
          error: { type: "GENERIC", messages: [reqJson.data.error] },
        } satisfies Superposition,
      ),
    );
  }

  return json({ success: true, data: reqJson.data } satisfies Superposition);
};
