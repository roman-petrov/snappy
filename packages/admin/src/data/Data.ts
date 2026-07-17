import { RpcContract } from "@snappy/admin-server-api";
import { Rpc } from "@snappy/rpc/client";

import { Auth } from "./Auth";

export const r = await Rpc(RpcContract, { auth: Auth });
