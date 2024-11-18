import { catchError, fetchJson, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { ApiError } from "api-railway/dist/types";
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

  const { url, method, headers, returnType } = ApiClient.stations.getStationsLikeQuery(q);

  const reqJson = await fetchJson<typeof returnType | ApiError>(url, { headers, method });

  if (!reqJson.success) {
    return json(
      reqJson satisfies Superposition,
      { status: reqJson.httpCode },
    );
  }

  if ("error" in reqJson.data) {
    return json(
      {
        success: false,
        httpCode: reqJson.data.httpCode,
        error: { type: "GENERIC", messages: [reqJson.data.error] },
      } satisfies Superposition,
      { status: reqJson.data.httpCode },
    );
  }

  return json({ success: true, data: reqJson.data } satisfies Superposition);
};
