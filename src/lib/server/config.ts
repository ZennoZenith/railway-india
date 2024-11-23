import {
  type InferOutput,
  literal,
  nonEmpty,
  number,
  object,
  optional,
  parse,
  pipe,
  string,
  trim,
  union,
} from "valibot";

const schema = object(
  {
    apiClient: object({
      API_VERSION: pipe(string(), trim(), nonEmpty("Api version cannot be empty")),
      API_KEY: optional(pipe(string(), trim(), nonEmpty("API key cannot be empty string"))),
      BASE_URL: pipe(string(), trim(), nonEmpty("API key cannot be empty string")),
      API_TIMEOUT: number(),
      PROTOCOL: union([literal("http"), literal("https")]),
    }),
  },
);

export type ConfigSchema = InferOutput<typeof schema>;

const defaultConfigValues = parse(schema, {
  apiClient: {
    API_VERSION: "v1",
    BASE_URL: "localhost:5000",
    PROTOCOL: "http",
    API_TIMEOUT: 3000,
  },
});

function meargeEnvs(c: ConfigSchema): ConfigSchema {
  const a: ConfigSchema = { apiClient: { ...c.apiClient } };
  a.apiClient.API_KEY = process.env.API_KEY ?? a.apiClient.API_KEY;
  a.apiClient.BASE_URL = process.env.BASE_URL ?? a.apiClient.BASE_URL;
  a.apiClient.PROTOCOL = process.env.PROTOCOL as ConfigSchema["apiClient"]["PROTOCOL"] ?? a.apiClient.PROTOCOL;
  a.apiClient.API_VERSION = process.env.API_VERSION ?? a.apiClient.API_VERSION;

  return parse(schema, a);
}

export const config = meargeEnvs(defaultConfigValues);
export default config;
