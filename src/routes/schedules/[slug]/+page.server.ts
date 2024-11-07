import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { data, error: err, apiError } = await ApiClient.trains.getTrain(params.slug);

  if (err) {
    error(500, err);
  }

  if (apiError) {
    error(apiError.http_code, JSON.stringify(apiError));
  }

  return {
    data,
  };
};
