/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
import type { ApiAuthBody, ApiForgotPasswordBody, ApiResetPasswordBody } from "@snappy/server-api";
import type { ServerAppApi } from "@snappy/server-app";
import type { Request, Response } from "express";

import { HttpStatus } from "@snappy/core";

import { hasError } from "../ApiResult";

const register = (api: ServerAppApi) => async (request: Request, response: Response) => {
  const body = (request.body ?? {}) as ApiAuthBody;
  const result = await api.auth.register(body);

  if (hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.status(HttpStatus.created).json({ token: result.token });
};

const login = (api: ServerAppApi) => async (request: Request, response: Response) => {
  const body = (request.body ?? {}) as ApiAuthBody;
  const result = await api.auth.login(body);

  if (hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.json({ token: result.token });
};

const forgotPassword = (api: ServerAppApi) => async (request: Request, response: Response) => {
  const body = (request.body ?? {}) as ApiForgotPasswordBody;
  const result = await api.auth.forgotPassword(body);

  if (hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.json(result);
};

const resetPassword = (api: ServerAppApi) => async (request: Request, response: Response) => {
  const body = (request.body ?? {}) as ApiResetPasswordBody;
  const result = await api.auth.resetPassword(body);

  if (hasError(result)) {
    response.status(result.status).json({ error: result.error });

    return;
  }

  response.json(result);
};

export const Auth = { forgotPassword, login, register, resetPassword };
