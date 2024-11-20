import type { ApiError } from "api-railway/dist/types";
import { forward, type InferOutput, nonEmpty, object, partialCheck, pipe, safeParse, string, trim } from "valibot";

const schema = pipe(
  object(
    {
      fromStation: pipe(string(), trim(), nonEmpty("From station cannot be empty")),
      toStation: pipe(string(), trim(), nonEmpty("To station cannot be empty")),
    },
  ),
  forward(
    partialCheck(
      [["fromStation"], ["toStation"]],
      (input) => input.fromStation !== input.toStation,
      "From and to station cannot be same",
    ),
    ["toStation"],
  ),
);

type Output = InferOutput<typeof schema>;

export type FormValidation = {
  success: boolean;
  fromStation: {
    value: string;
    error?: string | null;
  };
  toStation: {
    value: string;
    error?: string | null;
  };
  error?: ApiError | null;
};

export function parse(value: unknown): FormValidation {
  const results = safeParse(schema, value);

  if (results.success) {
    return createSuccessRet(results.output);
  }

  return {
    success: true,
    fromStation: {
      value: "",
      error: "Invalid from station",
    },
    toStation: {
      value: "",
      error: "Invalid to station",
    },
    error: null,
  } satisfies FormValidation;
}

function createSuccessRet({ fromStation, toStation }: Output): FormValidation {
  return {
    success: true,
    fromStation: {
      value: fromStation,
      error: null,
    },
    toStation: {
      value: toStation,
      error: null,
    },
    error: null,
  } satisfies FormValidation;
}
