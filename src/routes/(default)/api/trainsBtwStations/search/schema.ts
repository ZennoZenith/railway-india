import type { FormDataValidationError, Superposition } from "$lib";
import {
  check,
  flatten,
  forward,
  type InferOutput,
  literal,
  nonEmpty,
  object,
  optional,
  partialCheck,
  pipe,
  safeParse,
  string,
  toLowerCase,
  trim,
  union,
} from "valibot";

// const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const schema = pipe(
  object(
    {
      fromStation: pipe(string("fromStation should be string"), trim(), nonEmpty("From station invalid")),
      toStation: pipe(string("toStation should be string"), trim(), nonEmpty("To station invalid")),
      allTrains: optional(
        pipe(
          string(),
          trim(),
          toLowerCase(),
          union([literal("true"), literal("false")], "invalid allTrains, should be either true or false"),
        ),
      ),
      flexible: optional(
        pipe(
          string(),
          trim(),
          toLowerCase(),
          union([literal("true"), literal("false")], "invalid allTrains, should be either true or false"),
        ),
      ),
      date: pipe(string(), trim(), nonEmpty("Date cannot be empty"), check(isValidDate)),
    },
  ),
  forward(
    partialCheck(
      [["fromStation"], ["toStation"]],
      (input) => input.fromStation !== input.toStation,
      "From and To station cannot be equal",
    ),
    ["toStation"],
  ),
);
type Schema = InferOutput<typeof schema>;

export interface ValidationError extends FormDataValidationError {
  fromStation?: [string, ...string[]];
  toStation?: [string, ...string[]];
  flexible?: [string, ...string[]];
  allTrains?: [string, ...string[]];
  date?: [string, ...string[]];
}

export function validateSchema(data: unknown): Superposition<ValidationError, Schema> {
  const d = safeParse(schema, data);
  if (d.success) {
    return { success: true, data: d.output };
  }

  const issues = flatten<typeof schema>(d.issues);

  return {
    success: false,
    httpCode: 400,
    error: {
      type: "VALIDATION",
      messages: ["Validation error"],
      data: {
        ...issues.nested,
      },
    },
  };
}

function isValidDate(v: string) {
  const d = v.split("-");
  if (d.length !== 3) return false;

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(v)) return false;

  return !isNaN(new Date(v).getTime());
}
