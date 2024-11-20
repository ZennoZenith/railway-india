import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { ApiError, TrainInfo } from "api-railway/dist/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const trainNumber = params.slug;
  const { url, method, headers } = ApiClient.trains.getTrain(trainNumber.toString());

  const response = await catchError(fetch(url, {
    headers,
    method,
  }));

  if (response[0]) {
    console.error(response[0]);
    error(500, String(response[0]));
  }

  const data = await catchError<TrainInfo | ApiError>(response[1].json());
  if (data[0]) {
    console.error(data[0]);
    error(500, String(data[0]));
  }

  if (response[1].status > 299) {
    const err = data[1] as ApiError;
    return error(err.httpCode, JSON.stringify(err.error));
  }

  return data[1] as typeof _returnType;
};
