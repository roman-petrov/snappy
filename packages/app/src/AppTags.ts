import { Tags } from "@snappy/browser";

export const AppTags = Tags({
  auth: { signIn: [`submit`], signUp: [`submit`] },
  feed: { copy: [`click`], share: [`click`] },
  nav: [`feed`, `settings`, `snappy`],
  settings: { profile: { signOut: [`click`], topUp: [`open`, `submit`] } },
  snappy: {
    chat: [`start`],
    flow: [`snappy`, `static`],
    form: [`continue`],
    message: [`send`],
    preset: [`open`],
    voice: [`toggle`],
  },
} as const);
