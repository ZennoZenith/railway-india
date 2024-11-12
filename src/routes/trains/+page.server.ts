import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { type Actions, error, fail } from "@sveltejs/kit";
import type { ApiError, TrainGeneralInfo, TrainInfo } from "api-railway/dist/types";

export type FormError = { trainNumber?: string };
type FormReturnData = { returnType: "Error"; error: FormError } | { returnType: "TrainInfo"; data: TrainInfo };
export const actions = {
  train: async ({ request }) => {
    const formData = await request.formData();
    const trainNumber = formData.get("trainNumber");

    if (!trainNumber || trainNumber.toString().trim() === "") {
      return fail(400, { returnType: "Error", error: { trainNumber: "Train number is empty" } } as FormReturnData);
    }

    const { url, method, headers, returnType } = ApiClient.trains.getTrain(trainNumber.toString());

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
      return fail(err.httpCode, { returnType: "Error", error: { trainNumber: err.error } } as FormReturnData);
    }

    return { returnType: "TrainInfo", data: data[1] as typeof returnType } as FormReturnData;
  },

  search: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query");

    if (!query || query.toString().trim() === "") {
      return fail(400, { returnType: "Error", error: { trainNumber: "Train number is empty" } } as FormReturnData);
    }

    const { url, method, headers, returnType } = ApiClient.trains.getTrainsLikeQuery(query.toString());

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
      return fail(err.httpCode, { returnType: "Error", error: { trainNumber: err.error } } as FormReturnData);
    }

    return { returnType: "TrainGeneralInfo", data: data[1] as typeof returnType } as FormReturnData;
  },
} satisfies Actions;
