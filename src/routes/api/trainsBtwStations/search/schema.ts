import {
  flatten,
  type InferOutput,
  literal,
  nonEmpty,
  object,
  optional,
  pipe,
  safeParse,
  string,
  toLowerCase,
  trim,
  union,
} from "valibot";

// const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const schema = object(
  {
    fromStation: pipe(string("fromStation should be string"), trim(), nonEmpty("From station cannot be empty")),
    toStation: pipe(string("toStation should be string"), trim(), nonEmpty("To station cannot be empty")),
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
    date: optional(pipe(string(), trim())),
  },
);
type Schema = InferOutput<typeof schema>;

export type ValidationError = {
  fromStation?: [string, ...string[]];
  toStation?: [string, ...string[]];
  flexible?: [string, ...string[]];
  allTrains?: [string, ...string[]];
  date?: [string, ...string[]];
};

export function validateSchema(data: unknown): [undefined, Schema] | [ValidationError] {
  const d = safeParse(schema, data);
  if (d.success) {
    return [undefined, d.output];
  }

  const issues = flatten<typeof schema>(d.issues);

  return [{
    fromStation: issues.nested?.fromStation,
    toStation: issues.nested?.toStation,
    flexible: issues.nested?.flexible,
    allTrains: issues.nested?.allTrains,
    date: issues.nested?.date,
  }];
}
