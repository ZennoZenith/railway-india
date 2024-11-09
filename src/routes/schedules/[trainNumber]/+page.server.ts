import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { error } from "@sveltejs/kit";
import type { ApiError } from "api-railway/dist/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, url: orignalUrl }) => {
  const fullSchedule = orignalUrl.searchParams.get("fullSchedule") === "true" ? true : false;
  const trainNumber = params.trainNumber;
  const { url, method, headers, returnType } = ApiClient.schedules.getSchedule(trainNumber.toString(), fullSchedule);

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
    return error(err.httpCode, JSON.stringify(err.error));
  }

  return { schedule: data[1] as typeof returnType, fullSchedule };
};