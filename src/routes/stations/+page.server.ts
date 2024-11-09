import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { type Actions, error, fail } from "@sveltejs/kit";
import type { ApiError, StationInfo } from "api-railway/dist/types";

type FormReturnData = { success: false; station: string } | { success: true; data: StationInfo };

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const stationCode = formData.get("stationCode");

    if (!stationCode || stationCode.toString().trim() === "") {
      return fail(500, { success: false, station: "Station is undefined" } as FormReturnData);
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
      return fail(err.httpCode, { success: false, station: err.error } as FormReturnData);
    }

    return { success: true, data: data[1] as typeof returnType } as FormReturnData;
  },
} satisfies Actions;
