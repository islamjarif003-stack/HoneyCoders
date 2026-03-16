import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, verifyLink: string, name: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP not configured");
  }

  await transporter.sendMail({
    from: `"SourceStack" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email — SourceStack",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; line-height: 40px; color: white; font-weight: bold; font-size: 18px;">S</div>
          <h2 style="margin: 16px 0 0; color: #1a1a2e;">SourceStack</h2>
        </div>
        <h1 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Verify your email</h1>
        <p style="color: #555; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #555; line-height: 1.6;">Click the button below to verify your email address and activate your account.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyLink}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
        </div>
        <p style="color: #888; font-size: 13px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP not configured");
  }

  await transporter.sendMail({
    from: `"SourceStack" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password — SourceStack",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; line-height: 40px; color: white; font-weight: bold; font-size: 18px;">S</div>
          <h2 style="margin: 16px 0 0; color: #1a1a2e;">SourceStack</h2>
        </div>
        <h1 style="font-size: 22px; color: #1a1a2e; margin-bottom: 16px;">Reset your password</h1>
        <p style="color: #555; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new one.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 13px;">This link expires in 1 hour. If you didn't request a password reset, ignore this email.</p>
      </div>
    `,
  });
}

