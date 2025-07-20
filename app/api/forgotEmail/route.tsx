import dbConnect from "@/middleware/connect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_EMAIL;
  const baseURL = process.env.BASE_URL;

  if (!JWT_TOKEN || !baseURL) {
    return NextResponse.json(
      { message: "Missing environment variables" },
      { status: 500 }
    );
  }

  const { email } = await req.json();
  await dbConnect();

  try {
    const validEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: validEmail }).maxTimeMS(5000);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const name = user.name;
    const resetToken = jwt.sign({ email: validEmail }, JWT_TOKEN, {
      expiresIn: "5m",
    });
    const resetLink = `${baseURL}/resetPassword?token=${resetToken}`;

    const html = `
      <div style="max-width: 600px; padding: 20px; border-radius: 5px; line-height: 1.8; font-family: sans-serif;">
        <div style="border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <h2 style="color: #000;">Quick-Note</h2>
        </div>
        <p><strong>Dear ${name},</strong></p>
        <p>We received a request to reset the password for your Quick-Note account. Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #00bc69; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
        </div>
        <p>This link will expire in 5 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <br />
        <p><strong>Thank you for using Quick-Note.</strong></p>
        <p>Best regards,<br><strong>Quick-Note</strong></p>
        <hr style="border-top: 0.5px solid #ccc; margin-top: 40px;" />
        <p style="color: #aaa; font-size: 0.8em;">This email was sent automatically. Please do not reply.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: "Quick-Note <quicknote@jaydipsatani.com>",
      to: [validEmail],
      subject: "Password Reset Request",
      html,
    });

    if (result.error) {
      console.error("Resend email error:", result.error);
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password reset link sent to email",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email" }),
      { status: 500 }
    );
  }
}
