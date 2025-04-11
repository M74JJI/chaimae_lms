"use server";

import { db } from "@/lib/db";
import { CreateUserType } from "@/auth/types";
import { FormResponse } from "@/types";
import { getVerificationTokenByToken } from "./token.service";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error: any) {
    throw new Error("Error fetching user: ", error.message);
  }
};
export const createUser = async (user: CreateUserType) => {
  try {
    const newUser = await db.user.create({
      data: user,
    });
    return newUser;
  } catch (error: any) {
    throw new Error("Error creating user: " + error.message);
  }
};

export async function verifyUserAccount(token?: string): Promise<FormResponse> {
  if (!token) {
    return {
      message: "invaild token",
      success: false,
    };
  }
  try {
    const dbToken = await getVerificationTokenByToken(token);
    if (!dbToken)
      return {
        message: "invalid request or token may have been expired",
        success: false,
      };

    //  check if user exists
    const userExists = await getUserByEmail(dbToken.identifier);

    if (!userExists) {
      return {
        message: "user not found, try to signup first",
        success: false,
      };
    }
    if (userExists.emailVerified) {
      return {
        message: "Your account has already been verified.",
        success: false,
      };
    }

    //  check if token is  valid
    const expired = new Date(dbToken.expires) < new Date();
    if (expired)
      return {
        message: "token has been expired",
        success: false,
      };

    await db.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        emailVerified: new Date(),
        email: dbToken.identifier,
      },
    });

    return {
      message: "Email Verified Sucessfully",
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      message: "something went wrong",
      success: false,
    };
  }
}
