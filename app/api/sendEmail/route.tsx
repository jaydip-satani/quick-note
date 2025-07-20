import dbConnect from "@/middleware/connect";
import User from "@/models/User";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const JWT_TOKEN = process.env.JWT_EMAIL;
  if (!JWT_TOKEN) {
    return NextResponse.json(
      { message: "JWT_EMAIL environment variable is not defined" },
      { status: 500 }
    );
  }

  const { name, email } = await req.json();
  await dbConnect();
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const validEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: validEmail }).maxTimeMS(5000);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const response = await User.updateOne(
      { email: validEmail },
      { $set: { otp: otp } }
    );

    if (response.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update OTP" },
        { status: 400 }
      );
    }

    const emailHtml = `
      <div style="margin: 0 auto; max-width: 600px; font-family: sans-serif;">
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
          <h2 style="margin: 0; color: #000;">Quick-Note</h2>
        </div>
        <p><strong>Dear ${name},</strong></p>
        <p>We received a login request for your Quick-Note account. Please verify your identity by using the OTP below:</p>
        <h2 style="background: linear-gradient(to right, #00bc69, #00bc88, #00bca8); display: inline-block; padding: 8px 16px; color: #fff; border-radius: 4px;">${otp}</h2>
        <p><strong>Note:</strong> OTP is valid for 3 minutes.</p>
        <p style="color: red;"><strong>Your secure notes password is the same as your login password.</strong></p>
        <p>If you didn't initiate this login, please ignore this message.</p>
        <p>Thank you,<br><strong>Quick-Note Team</strong></p>
        <hr />
        <p style="color: #aaa; font-size: 0.8em;">This is an automated email. Please do not reply.</p>
        <p style="color: #aaa; font-size: 0.8em;">&copy; ${new Date().getFullYear()} Quick-Note. All rights reserved.</p>
      </div>
    `;

    const send = await resend.emails.send({
      from: "Quick-Note <quicknote@jaydipsatani.com>",
      to: [validEmail],
      subject: "Your OTP Verification Code",
      html: emailHtml,
    });

    if (send.error) {
      console.error("Resend email failed:", send.error);
      return new Response(
        JSON.stringify({ success: false, error: send.error }),
        {
          status: 500,
        }
      );
    }

    const authtoken = jwt.sign(email, JWT_TOKEN);
    return new Response(JSON.stringify({ success: true, authtoken }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500 }
    );
  }
}
