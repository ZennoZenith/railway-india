import { handleApiResponseError } from "$lib";
import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const stationCode = params.slug;
  const errorJson = await ApiClient.stations.getStation(stationCode.toString());

  const handledResponse = handleApiResponseError(errorJson);

  if (!handledResponse.success) {
    error(handledResponse.httpCode, JSON.stringify(handledResponse));
  }

  return { data: handledResponse.data };
};
