import { Trpc } from "@snappy/server-module";

export const AdminTrpcContext = Trpc.context<{
  admin?: true;
  clearSessionCookie: () => void;
  setSessionCookie: (token: string) => void;
}>();

export const AdminTrpcAuth = Trpc.auth(AdminTrpcContext, context =>
  context.admin === true ? { admin: true as const } : undefined,
);
