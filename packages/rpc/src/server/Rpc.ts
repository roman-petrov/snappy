import type { FastifyInstance } from "fastify";

import type { Contract } from "../Endpoint";

import { type ContextFor, Register, type RegisterConfig } from "./Register";

type MountConfig<TModules extends object, TContext extends object> = Omit<
  RegisterConfig<TContext, TModules>,
  `app` | `path`
>;

const mount = async <TModules extends object, TContext extends ContextFor<TModules>>(
  app: FastifyInstance,
  contract: Contract<TModules>,
  { context, modules, userId }: MountConfig<TModules, TContext>,
) => Register({ app, context, modules, path: contract.path, userId });

export const Rpc = { mount };
