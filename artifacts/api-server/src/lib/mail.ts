import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromAddress: string;
  fromName: string;
  adminNotificationEmails: string[];
};

let transporter: Transporter | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required mail environment variable: ${name}`);
  }
  return value;
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? "465");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port");
  }
  return port;
}

function parseSecure(value: string | undefined, port: number): boolean {
  if (value === undefined || value.trim() === "") return port === 465;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new Error("SMTP_SECURE must be true or false");
}

export function parseAdminNotificationEmails(value: string): string[] {
  const emails = value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (emails.length === 0) {
    throw new Error("ADMIN_NOTIFICATION_EMAIL must contain at least one address");
  }

  return emails;
}

export function getMailConfig(): MailConfig {
  const port = parsePort(process.env.SMTP_PORT);

  return {
    host: requiredEnv("SMTP_HOST"),
    port,
    secure: parseSecure(process.env.SMTP_SECURE, port),
    user: requiredEnv("SMTP_USER"),
    password: requiredEnv("SMTP_PASSWORD"),
    fromAddress: process.env.SMTP_FROM_ADDRESS?.trim() || requiredEnv("SMTP_USER"),
    fromName: process.env.SMTP_FROM_NAME?.trim() || "RCC Royal Car Cleaning",
    adminNotificationEmails: parseAdminNotificationEmails(
      requiredEnv("ADMIN_NOTIFICATION_EMAIL"),
    ),
  };
}

export function getMailTransport(): Transporter {
  if (transporter) return transporter;

  const config = getMailConfig();
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  return transporter;
}

export async function verifyMailTransport(): Promise<void> {
  await getMailTransport().verify();
}