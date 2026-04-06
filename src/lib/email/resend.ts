import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export function getResend(): Resend | null {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

export const notificationEmail = process.env.NOTIFICATION_EMAIL ?? "";
