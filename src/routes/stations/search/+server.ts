import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import type { DropDownListItem } from "$lib/types";
import { error, json } from "@sveltejs/kit";
import type { ApiError } from "api-railway/dist/types";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const j = await catchError<{ q: string | undefined }>(request.json());

  if (j[0]) {
    error(400, JSON.stringify({ error: "Invalid json" }));
  }

  const { q } = j[1];

  if (!q) {
    error(400, JSON.stringify({ error: "q is empty" }));
  }

  const { url, method, headers, returnType } = ApiClient.stations.getStationsLikeQuery(q);

  const response = await catchError(fetch(url, {
    headers,
    method,
  }));

  if (response[0]) {
    console.error(response[0]);
    error(500, String(response[0]));
  }

  const data = await catchError<typeof returnType | ApiError>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    error(500, String(data[0]));
  }

  if (response[1].status > 299) {
    const err = data[1] as ApiError;
    error(err.httpCode, JSON.stringify({ error: err.error }));
  }

  const d: DropDownListItem[] = (data[1] as typeof returnType).map((val) => {
    return {
      dataText: val.stationCode,
      text: `${val.stationName} (${val.stationCode})`,
      key: val.id.toString(),
    } satisfies DropDownListItem;
  });
  return json(d);
};
