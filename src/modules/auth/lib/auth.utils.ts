import { nanoid } from "nanoid";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "@/auth/services";
import { EmailService } from "@/auth/services/mail.service";

export async function generateUniqueUsername(
  firstName: string,
  lastName: string
): Promise<string> {
  // Normalize names and create a base username
  const baseUsername = slugify(`${firstName} ${lastName}`, {
    lower: true,
    strict: true,
    trim: true,
  }).replace(/-/g, "");

  let username = baseUsername;
  let counter = 1;

  while (true) {
    // Check if username exists in the database
    const existingUser = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!existingUser) break; // Username is unique

    // Modify username by appending a numeric suffix or nanoid
    username = `${baseUsername}${counter < 5 ? counter : nanoid(5)}`;
    counter++;
  }

  return username;
}

export const hashMyPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export async function createVerificationTokenHandler(email: string) {
  try {
    const exists = await getVerificationTokenByEmail(email);
    if (exists) {
      await deleteVerificationToken(exists);
    }
    // creating a new token
    const token = await createVerificationToken(email);
    return token;
  } catch (error) {
    console.log("Error in getVerificationToken", error);
    return null;
  }
}

export async function sendEmailVerification(email: string, token: string) {
  const verificationLink = `${process.env.HOST}/auth/account-verification?token=${token}`;
  const sender = new EmailService();
  await sender.sendVerificationEmail(email, verificationLink);
}
