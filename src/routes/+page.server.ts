import { catchError } from "$lib";
import ApiClient from "$lib/server/api";
import { type Actions, error, fail } from "@sveltejs/kit";
import type { ApiError, TrainsBetweenStations } from "api-railway/dist/types";
import { type FormValidation, parse } from "./schema";

type Ret = FormValidation & {
  data: TrainsBetweenStations[] | undefined;
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const fromStation = formData.get("fromStation")?.toString();
    const toStation = formData.get("toStation")?.toString();

    const form: Ret = {
      ...parse({ fromStation: fromStation, toStation }),
      data: undefined,
    };

    if (!form.success) {
      return fail(400, form satisfies Ret as Ret);
    }

    let fromS = form.fromStation.value;
    let toS = form.toStation.value;

    const { url, method, headers, returnType } = ApiClient.trainsBtwStations.getTrainsBtwStations(fromS, toS);

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
      return fail(
        err.httpCode,
        { ...form, success: false, error: err, data: undefined } satisfies Ret as Ret,
      );
    }

    return { ...form, error: null, data: data[1] as TrainsBetweenStations[] } satisfies Ret as Ret;
  },
} satisfies Actions;
