import { handleApiResponseError } from "$lib";
import ApiClient from "$lib/server/api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, url }) => {
  const fullSchedule = url.searchParams.get("fullSchedule")?.toLowerCase().trim() === "true" ? true : false;
  const errorJson = await ApiClient.schedules.getSchedule(
    params.slug,
    fullSchedule,
  );

  const handledResponse = handleApiResponseError(errorJson);

  return json(handledResponse, { status: handledResponse.success === false ? handledResponse.httpCode : 200 });
};
