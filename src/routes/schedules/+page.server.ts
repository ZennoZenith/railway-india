import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { type Actions, error, fail } from "@sveltejs/kit";
import type { ApiError, ScheduleRow } from "api-railway/dist/types";

type FormReturnData = { success: false; error: { trainNumber: string } } | {
  success: true;
  schedule: ScheduleRow[];
  trainNumber: string;
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const trainNumber = formData.get("trainNumber");

    if (!trainNumber) {
      return fail(500, { success: false, error: { trainNumber: "Train number in undefined" } } as FormReturnData);
    }

    if (trainNumber.toString().trim() === "") {
      return fail(400, { success: false, error: { trainNumber: "Train number is empty" } } as FormReturnData);
    }

    const { url, method, headers, returnType } = ApiClient.schedules.getSchedule(trainNumber.toString());

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
      return fail(err.httpCode, { success: false, error: { trainNumber: err.error } } as FormReturnData);
    }

    return { success: true, schedule: data[1] as typeof returnType, trainNumber } as FormReturnData;
  },
} satisfies Actions;
