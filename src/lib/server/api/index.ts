import { config } from "$lib/server/config";
import { Client } from "api-railway";

export default new Client({ ...config.apiClient });
