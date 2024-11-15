import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { type Actions, error, fail } from "@sveltejs/kit";
import type { ApiError, StationInfo } from "api-railway/dist/types";

export type FormError = { stationCode?: string };
type FormReturnData = { returnType: "Error"; error: FormError } | { returnType: "Station"; data: StationInfo };

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const stationCode = formData.get("stationCode");

    if (!stationCode || stationCode.toString().trim() === "") {
      return fail(400, { returnType: "Error", error: { stationCode: "Station is empty" } } as FormReturnData);
    }

    const { url, method, headers, returnType } = ApiClient.stations.getStation(stationCode.toString());

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
      return fail(err.httpCode, { returnType: "Error", error: { stationCode: err.error } } as FormReturnData);
    }

    return { returnType: "Station", data: data[1] as typeof returnType } as FormReturnData;
  },
} satisfies Actions;
