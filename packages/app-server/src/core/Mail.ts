import type { Email } from "@snappy/email";

import { Config } from "@snappy/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  auth: { pass: Config.smtpPassword, user: Config.smtpUser },
  host: Config.smtpHost,
  port: Config.smtpPort,
  secure: true,
});

const send = async (to: string, email: Email) => transporter.sendMail({ from: Config.smtpFrom, to, ...email });

export const Mail = { send };
