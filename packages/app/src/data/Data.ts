import { RpcContract } from "@snappy/app-server-api";
import { Rpc } from "@snappy/rpc/client";

import { KnownUser } from "../core";
import { Auth } from "./Auth";

export const r = await Rpc(RpcContract, { auth: Auth, onOpen: KnownUser.mark });
