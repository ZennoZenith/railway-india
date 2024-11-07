import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { ApiError } from "api-railway";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { url, method, headers, returnType } = ApiClient.trains.getTrain(params.slug);

  let response = await catchError(fetch(url, {
    headers,
    method,
  }));

  if (response[0]) {
    console.error(response[0]);
    error(500, String(response[0]));
  }

  let data = await catchError<typeof returnType | ApiError>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    error(500, String(data[0]));
  }

  if (response[1].status > 299) {
    let err = data[1] as ApiError;
    console.log(data[1]);
    error(err.httpCode, JSON.stringify(data[1]));
  }

  return data[1] as typeof returnType;
};
