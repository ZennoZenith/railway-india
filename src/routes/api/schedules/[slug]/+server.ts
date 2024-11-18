import { catchError, fetchJson, type Superposition } from "$lib";
import ApiClient from "$lib/server/api";
import type { DropDownListItem } from "$lib/types";
import { error, json } from "@sveltejs/kit";
import type { ApiError } from "api-railway/dist/types";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, params, url }) => {
  const fullSchedule = url.searchParams.get("fullSchedule")?.toLowerCase().trim() === "true" ? true : false;
  const { url: reqUrl, method, headers, returnType } = ApiClient.schedules.getSchedule(
    params.slug,
    fullSchedule,
  );

  const reqJson = await fetchJson<typeof returnType | ApiError>(reqUrl, { headers, method });

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
