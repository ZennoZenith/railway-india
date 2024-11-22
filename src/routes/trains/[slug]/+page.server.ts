import { handleApiResponseError } from "$lib";
import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const trainNumber = params.slug;
  const errorJson = await ApiClient.trains.getTrain(trainNumber.toString());

  const handledResponse = handleApiResponseError(errorJson);

  if (!handledResponse.success) {
    error(handledResponse.httpCode, JSON.stringify(handledResponse));
  }

  return { data: handledResponse.data };
};
