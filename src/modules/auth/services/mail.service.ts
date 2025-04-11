import * as nodemailer from "nodemailer";
import { EmailTemplate } from "@/auth/data/templates/template";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER_EMAIL,
        pass: process.env.GMAIL_SENDER_PASSWORD,
      },
    });
  }

  getTransport() {
    return this.transporter;
  }

  async sendResetPasswordEmail(
    email: string,
    verificationLink: string
  ): Promise<boolean> {
    const year = "2025";
    const template = await EmailTemplate.getTemplate("reset-password.html", {
      verificationLink,
      year,
    });

    const mailOptions = {
      from: process.env.GMAIL_SENDER_EMAIL,
      to: email,
      subject: "Resetting Password",
      html: template, // Use HTML template instead of plain text
    };

    const res = await this.transporter.sendMail(mailOptions);

    return res.accepted.length > 0;
  }
  async sendVerificationEmail(
    email: string,
    verificationLink: string
  ): Promise<boolean> {
    const year = "2025";
    const template = await EmailTemplate.getTemplate("verification.html", {
      verificationLink,
      year,
    });

    const mailOptions = {
      from: "emailverification@yourapp.com",
      to: email,
      subject: "Email Verification",
      html: template, // Use HTML template instead of plain text
    };

    const res = await this.transporter.sendMail(mailOptions);

    return res.accepted.length > 0;
  }
}
