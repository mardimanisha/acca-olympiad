/**
 * Emails through the Google Workspace mailbox over Gmail SMTP: the OTP that verifies the student's email,
 * and the registration confirmation. Workspace allows about 2,000 emails a day per mailbox.
 *
 * Env: SMTP_USER (the mailbox, e.g. communications@zskillup.com), SMTP_PASS (a 16-character App Password
 * for that mailbox, created under Google Account → Security → App passwords), optional EMAIL_FROM_NAME
 * (sender name shown to students).
 */

import nodemailer, { type Transporter } from "nodemailer";
import { EVENT } from "@/lib/content";

let transport: Transporter | null = null;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const firstName = (name: string) => escape(name.split(/\s+/)[0] || "there");

async function send(to: string, subject: string, html: string) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("email: SMTP_USER or SMTP_PASS is not set");

  transport ??= nodemailer.createTransport({
    // 587 + STARTTLS rather than 465: some antivirus mail shields intercept 465 locally and break certificate checks.
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass: pass.replace(/\s/g, "") },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
  await transport.sendMail({
    from: { name: process.env.EMAIL_FROM_NAME || EVENT.name, address: user },
    to,
    subject,
    html,
  });
}

export function sendOtpEmail(to: string, name: string, otp: string, minutes: number) {
  return send(
    to,
    `${otp} is your ${EVENT.short} verification code`,
    `<p>Hi ${firstName(name)},</p>
<p>Your OTP to complete your ${EVENT.name} registration is:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p>
<p>It is valid for ${minutes} minutes. Do not share it with anyone.</p>
<p>If you didn't request this, you can ignore this email.</p>
<p>Team ZSkillup</p>`,
  );
}

export function sendConfirmationEmail(to: string, name: string) {
  return send(
    to,
    `You're registered for ${EVENT.name}`,
    `<p>Hi ${firstName(name)},</p>
<p>Your registration for <b>${EVENT.name}</b> is confirmed. The Olympiad is on <b>${EVENT.dateLong}</b>.</p>
<p>Exam instructions will be sent to this email closer to the date.</p>
<p>Questions? Call us on ${EVENT.phone}.</p>
<p>Team ZSkillup</p>`,
  );
}
