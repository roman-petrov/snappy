import { ServerApi } from "@snappy/server-api";

export const api = ServerApi({ auth: { type: `jwt` }, baseUrl: `` });
