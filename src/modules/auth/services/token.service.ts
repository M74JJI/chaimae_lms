"use server";

import { db } from "@/lib/db";
import { VerificationToken } from "@prisma/client";
import * as v4 from "uuid";

export const createVerificationToken = async (email: string) => {
  try {
    const token = await db.verificationToken.create({
      data: {
        identifier: email,
        token: v4.v4(),
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
    return token;
  } catch (error: any) {
    throw new Error("Error creating token: " + error.message);
  }
};

export async function getVerificationTokenByEmail(email: string) {
  try {
    const token = await db.verificationToken.findFirst({
      where: {
        identifier: email,
      },
    });
    return token;
  } catch (error: any) {
    throw new Error("Error getting token: " + error.message);
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const t = await db.verificationToken.findFirst({
      where: {
        token,
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getVerificationToken", error);
    return null;
  }
}

export const deleteVerificationToken = async (token: VerificationToken) => {
  try {
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: token.identifier,
          token: token.token,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Error deleting token: " + error.message);
  }
};
