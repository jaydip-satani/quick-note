import dbConnect from '@/middleware/connect';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const JWT_TOKEN = process.env.JWT_EMAIL;
  if (!JWT_TOKEN) {
    return NextResponse.json({ message: 'JWT_EMAIL environment variable is not defined' }, { status: 500 });
  }
  const { name, email } = await req.json();
  dbConnect();
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const validEmail = email.trim().toLowerCase();
    try {
      let user = await User.findOne({ email: validEmail }).maxTimeMS(5000);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
    } catch (error: any) {
      console.error('Query failed or timed out:', error);
      return NextResponse.json({ message: 'User Not Registered: ' + error.message }, { status: 400 });
    }
    let response = await User.updateOne(
      { email: validEmail },
      { $set: { otp: otp } }
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP Verification',
      html: `
           <div class="container" style="margin: 0 auto; width: 100%; max-width: 600px; padding: 0 0px; padding-bottom: 10px; border-radius: 5px; line-height: 1.8;">
  <div class="header" style="border-bottom: 1px solid #eee;">
    <a style="font-size: 1.4em; color: #000; text-decoration: none; font-weight: 600;">Notely</a>
  </div>
  <br />
  <strong>Dear ${name},</strong>
  <p>
    We have received a login request for your Notely account. For
    security purposes, please verify your identity by providing the
    following One-Time Password (OTP).
    <br />
    <b>Your One-Time Password (OTP) verification code is:</b>
  </p>
  <h2 class="otp" style="background: linear-gradient(to right, #00bc69 0, #00bc88 50%, #00bca8 100%); margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
  <p style="font-size: 0.9em">
    <strong>One-Time Password (OTP) is valid for 3 minutes.</strong>
    <br />
    <br />
    If you did not initiate this login request, please disregard this
    message. Please ensure the confidentiality of your OTP and do not share
    it with anyone.<br />
    <strong>Do not forward or give this code to anyone.</strong>
    <br />
    <br />
    <strong>Thank you for using Notely.</strong>
    <br />
    <br />
    Best regards,
    <br />
    <strong>Notely</strong>
  </p>
  <hr style="border: none; border-top: 0.5px solid #131111" />
  <div class="footer" style="color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
    <p>This email can't receive replies.</p>
    <p>
      For more information about Notely and your account, visit
      <strong>Notely</strong>
    </p>
  </div>
</div>
<div style="text-align: center">
  <div class="email-info" style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
    <span>
      This email was sent to
      <a href="mailto:${email}" style="text-decoration: none; color: #00bc69;">${email}</a>
    </span>
  </div>
  <div class="email-info" style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
    <a href="jaydipsatani.com" style="text-decoration: none; color: #00bc69;">Notely</a>
  </div>
  <div class="email-info" style="color: #666666; font-weight: 400; font-size: 13px; line-height: 18px; padding-bottom: 6px;">
    &copy; ${new Date().getFullYear()} Notely. All rights reserved.
  </div>
</div>
`,
    };

    if (response) {
      const authtoken = jwt.sign(email, JWT_TOKEN);

      await transporter.sendMail(mailOptions);
      return new Response(JSON.stringify({ success: true, authtoken: authtoken }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 400 });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500 });
  }
}
