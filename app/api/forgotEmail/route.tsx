import dbConnect from '@/middleware/connect';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_EMAIL;
    const baseURL = process.env.BASE_URL
    if (!JWT_TOKEN) {
        return NextResponse.json({ message: 'JWT_EMAIL environment variable is not defined' }, { status: 500 });
    }

    const { email } = await req.json();
    dbConnect();

    try {
        const validEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: validEmail }).maxTimeMS(5000);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        const name = user.name;
        console.log(name)
        const resetToken = jwt.sign({ email: validEmail }, JWT_TOKEN, { expiresIn: '5m' });

        const resetLink = `${baseURL}/resetPassword?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER as string,
                pass: process.env.EMAIL_PASS as string,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <div class="container" style="max-width: 600px; padding: 20px; border-radius: 5px; line-height: 1.8;">
          <div class="header" style="border-bottom: 1px solid #eee;">
            <a style="font-size: 1.4em; color: #000; text-decoration: none; font-weight: 600;">Notely</a>
          </div>
          <br />
          <strong>Dear ${name},</strong>
          <p>
            We received a request to reset the password for your Notely account. Please click the link below to reset your password:
          </p>
          <a href="${resetLink}" style="background-color: #00bc69; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
          <p>
            This link will expire in 5 min.
          </p>
          <br />
          If you did not request a password reset, please ignore this email.
          <br />
          <strong>Thank you for using Notely.</strong>
          <br />
          <br />
          Best regards,
          <br />
          <strong>Notely</strong>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true, message: 'Password reset link sent to email' }), { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500 });
    }
}
