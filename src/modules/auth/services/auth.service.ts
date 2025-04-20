"use server";
import * as v4 from "uuid";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
  EmailSignInLinkSchema,
  EmailSignInLinkSchemaType,
  ResetPasswordSchema,
  ResetPasswordSchemaType,
  SignInSchema,
  SignInSchemaType,
  SignupSchema,
  SignupSchemaType,
} from "@/auth/schemas";
import { ErrorCode, FormResponse } from "@/types";
import {
  createVerificationTokenHandler,
  generateUniqueUsername,
  hashMyPassword,
  sendEmailVerification,
} from "@/auth/lib";
import { createUser, getUserByEmail } from "./user.service";
import { AuthError } from "next-auth";
import { signIn as SignInHandler } from "@/auth";
import { HOST } from "@/constants";

import { NodemailerConfig } from "next-auth/providers/nodemailer";
import { EmailService } from "./mail.service";
import { db } from "@/lib/db";
import {
  isRedirectError,
  RedirectError,
} from "next/dist/client/components/redirect-error";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { UserService } from "./userr.servicee";
import bcrypt from "bcryptjs";
import {
  getDeviceFingerprint,
  getFullFingerprint,
  getGeoFingerprint,
  getIPFingerprint,
  getPrivateFingerprint,
} from "@/lib/client-fingerprint";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { ErrorMessages } from "@/types/common";
import { RateLimiter } from "@/lib/rate-limiter";
import { startSpan } from "@/lib/tracing";
import logger from "@/lib/logger";
import { RateLimitError } from "@/lib/errors";
import { handleServiceError } from "@/lib/error-handler";
export async function signUp(data: SignupSchemaType): Promise<FormResponse> {
  const fingerprint = await getFullFingerprint();

  /*
  await RateLimiter.check(
    fingerprint,
    60,
    "1m",
    "Too many API requests",
    false
  );

*/

  const validate = await SignupSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      message: validate.error.errors[0].message || "Invalid credentials",
      success: false,
    };
  }

  const { email, password, firstName, lastName, phoneNumber } = validate.data;

  try {
    const userExists = await UserService.getUserByEmail(email, {
      name: "aaaaaa",
    });
    if (userExists) {
      return { message: "User already exists", success: false };
    }

    const hashedPassword = await hashMyPassword(password);

    const username = await generateUniqueUsername(firstName, lastName);

    await createUser({
      email,
      password: hashedPassword,
      username,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phoneNumber,
      role: "USER",
    });

    const token = await createVerificationTokenHandler(email);
    if (!token) {
      return { message: "Something went wrong!", success: false };
    }

    await sendEmailVerification(email, token.token);

    return { message: "Confirmation Email Sent", success: true };
  } catch (error) {
    return {
      message: "An error occurred during sign-up",
      success: false,
    };
  }
}

export async function signIn(data: SignInSchemaType): Promise<FormResponse> {
  // Generate a unique request ID for this specific sign-in attempt
  const requestId = crypto.randomUUID();

  // Start a trace span for the sign-in process
  const span = startSpan("auth_signin", {
    "operation.id": requestId,
    "operation.type": "signin",
  });

  try {
    // Log the start of the sign-in process
    logger.info("Sign-in attempt started", {
      meta: { requestId, email: data.email },
    });

    // Rate limit check
    await RateLimiter.check(
      data.email,
      3,
      "1m",
      ErrorMessages.RATE_LIMITED,
      true
    );

    // Validate input data
    const validate = await SignInSchema.safeParseAsync(data);
    if (!validate.success) {
      logger.warn("Invalid sign-in data", {
        meta: { requestId, errors: validate.error.errors },
      });

      return {
        success: false,
        code: ErrorCode.VALIDATION_ERROR,
        message: validate.error.errors[0].message,
      };
    }

    const { email, password } = validate.data;

    // Trace user retrieval
    const userSpan = startSpan("auth_signin_getUserByEmail", {
      email: email,
      "request.id": requestId,
    });

    const user = await UserService.getUserByEmail(email, {
      name: "auth_signin_getUserByEmail",
    });
    userSpan.end(); // End the span for user retrieval

    if (!user?.email || !user.password) {
      const userNotFoundSpan = startSpan("auth_signin_user_not_found", {
        email: email,
        "request.id": requestId,
      });

      logger.warn("User not found or password missing", {
        meta: { requestId, email },
      });

      userNotFoundSpan.end(); // End the span for user not found

      return {
        success: false,
        code: ErrorCode.AUTH_ERROR,
        message: ErrorMessages.AUTH_ERROR,
      };
    }

    // Validate password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      const invalidPasswordSpan = startSpan("auth_signin_invalid_password", {
        email: email,
        "request.id": requestId,
      });

      logger.warn("Invalid password", {
        meta: { requestId, email },
      });

      invalidPasswordSpan.end(); // End the span for invalid password

      return {
        success: false,
        code: ErrorCode.AUTH_ERROR,
        message: ErrorMessages.AUTH_ERROR,
      };
    }

    // Check if the user’s email is verified
    if (!user.emailVerified) {
      try {
        const token = await createVerificationTokenHandler(email);
        if (!token) {
          logger.error("Token creation failed", {
            meta: { requestId, email },
          });

          return {
            success: false,
            code: ErrorCode.INTERNAL_ERROR,
            message: ErrorMessages.INTERNAL_ERROR,
          };
        }
        await sendEmailVerification(email, token.token);

        // Log that a verification email was sent
        logger.info("Confirmation email sent", {
          meta: { requestId, email },
        });

        return { success: true, message: "Confirmation Email Sent" };
      } catch (error: any) {
        logger.error("Error sending verification email", {
          meta: { requestId, email },
          error: error.message,
        });

        return {
          success: false,
          code: ErrorCode.INTERNAL_ERROR,
          message: ErrorMessages.INTERNAL_ERROR,
        };
      }
    }

    // Trace the sign-in process with SignInHandler
    const signinSpan = startSpan("auth_signin_signInHandler", {
      email: email,
      "request.id": requestId,
    });

    try {
      await SignInHandler("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });

      signinSpan.end(); // End the sign-in handler span

      logger.info("Sign-in successful", {
        meta: { requestId, email },
      });

      return { success: true, message: "Sign-in successful" };
    } catch (error: any) {
      signinSpan.end(); // Ensure the span ends even in case of error

      if (isRedirectError(error)) {
        logger.error("Redirect error during sign-in", {
          meta: { requestId, email },
          error: error.message,
        });
        throw error;
      }

      if (error instanceof AuthError) {
        logger.error("Authentication error", {
          meta: { requestId, email },
          error: error.message,
        });

        return error.type === "CredentialsSignin"
          ? {
              success: false,
              code: ErrorCode.AUTH_ERROR,
              message: ErrorMessages.AUTH_ERROR,
            }
          : {
              success: false,
              code: ErrorCode.INTERNAL_ERROR,
              message: ErrorMessages.INTERNAL_ERROR,
            };
      }

      // Catch-all for unexpected errors
      logger.error("Unexpected error during sign-in", {
        meta: { requestId, email },
        error: error.message,
      });

      return {
        success: false,
        code: ErrorCode.INTERNAL_ERROR,
        message: ErrorMessages.INTERNAL_ERROR,
      };
    }
  } catch (error: any) {
    const errorResponse = handleServiceError(error, requestId);
    return errorResponse;
  } finally {
    span.end(); // End the span for the entire sign-in process
  }
}

export async function signInWithEmailLink(
  data: EmailSignInLinkSchemaType
): Promise<FormResponse> {
  const fingerprint = await getFullFingerprint();

  const validate = await EmailSignInLinkSchema.safeParseAsync(data);
  if (!validate.success) {
    return { message: validate.error.errors[0].message, success: false };
  }

  const { email } = validate.data;

  try {
    await SignInHandler("http-email", { email });

    return {
      message: `An email link has been sent to ${email}. Please check your inbox.`,
      success: true,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      handleSignInRedirectError(error, data);
    } else {
    }

    return {
      message: error instanceof Error ? error.message : "Failed to send email",
      success: false,
    };
  }
}

const handleSignInRedirectError = (
  error: RedirectError,
  data: EmailSignInLinkSchemaType
) => {
  let digest = error.digest;
  const replace = "NEXT_REDIRECT;replace;";
  const isNotFound = replace + HOST + "/auth/signup;303;" === error.digest;
  const successDigest =
    replace +
    HOST +
    "/api/auth/verify-request?provider=http-email&type=email;303;";
  const isSuccess = error.digest === successDigest;
  if (isNotFound)
    digest =
      replace +
      `${HOST}/auth/signup?callbackError=badSignInEmail&email=${
        data.email
      }&at=${new Date().toLocaleTimeString()};303`;
  else if (isSuccess) {
    digest =
      replace +
      `${HOST}/auth/verify-request?email=${data.email}&provider=http-email&type=email;303`;
  }

  let err = { ...error, digest };
  throw err;
};

export interface EmailTheme {
  colorScheme?: "auto" | "dark" | "light";
  logo?: string;
  brandColor?: string;
  buttonText?: string;
}

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: NodemailerConfig;
  token: string;
  theme: EmailTheme;
  request: Request;
}) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  const service = new EmailService();
  const transport = service.getTransport();
  await db.verificationToken.deleteMany({
    where: {
      identifier,
      token: { not: params.token },
    },
  });
  try {
    const result = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: generateText({ url, host }),
      html: generateHTML({ url, host, theme }),
    });

    const failed = result.rejected.concat(result.pending).filter(Boolean);
    if (failed.length) {
      throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    // throw error;
  }
}

export async function forgotPasswordAction(
  data: ForgotPasswordSchemaType
): Promise<FormResponse> {
  try {
    const validate = ForgotPasswordSchema.safeParse(data);
    if (!validate.success) {
      return {
        message: validate.error.errors[0].message || "Invalid email",
        success: false,
      };
    }

    const { email } = validate.data;
    // send email with reset password link
    const existingUser = await UserService.getUserByEmail(email, { name: "b" });
    if (!existingUser) {
      return {
        message: "user may not exist or verified",
        success: false,
      };
    }
    if (!existingUser?.password) {
      // means the user signed up with social media
      return {
        message:
          "this account requires social media login or it does not exist",
        success: false,
      };
    }
    const token = await createResetPasswordToken(email);
    if (!token) {
      return {
        message: "Something went wrong",
        success: false,
      };
    }
    await sendResetPasswordEmail(email, token?.token);

    return {
      message: "Email Sent Successfully",
      success: true,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      success: false,
    };
  }
}

function generateHTML(params: {
  url: string;
  host: string;
  theme: EmailTheme;
}) {
  const { url, host, theme } = params;
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#4F46E5"; // A modern shade of blue (indigo-600 from Tailwind)
  const color = {
    background: "#f3f4f6", // Slightly darker gray for better contrast
    text: "#333333", // Darker text color for improved readability
    mainBackground: "#ffffff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#ffffff",
    footerText: "#9CA3AF", // Neutral gray for footer text
  };

  return `
    <body style="background: ${
      color.background
    }; margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: ${
        color.background
      }; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="max-width: 600px; margin: auto; background: ${
              color.mainBackground
            }; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  ${`<img src="${theme?.logo}" alt="${escapedHost}" style="height: 50px; margin-bottom: 24px;" />`}
                  <h1 style="font-size: 24px; color: ${
                    color.text
                  }; margin: 0;">Sign in to <strong>${escapedHost}</strong></h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 0 40px 40px;">
                  <p style="font-size: 16px; color: ${
                    color.text
                  }; margin: 0 0 24px;">
                    Click the button below to sign in. This link is only valid for the next 24 hours.
                  </p>
                  <a href="${url}" target="_blank"
                    style="display: inline-block; padding: 14px 28px; font-size: 16px; color: ${
                      color.buttonText
                    }; background-color: ${
    color.buttonBackground
  }; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 0 auto;">
                    Sign in
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px; font-size: 14px; color: ${
                  color.footerText
                };">
                  If you did not request this email, you can safely ignore it.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;
}
function generateText({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\nIf you did not request this email, you can safely ignore it.\nThis link is only valid for the next 24 hours.`;
}

export const createResetPasswordToken = async (email: string) => {
  try {
    const exists = await getResetPasswordToken(email);
    if (exists) {
      await db.resetPasswordToken.delete({
        where: {
          id: exists.id,
        },
      });
    }
    //    creating a new token
    const token = await db.resetPasswordToken.create({
      data: {
        email,
        token: v4.v4(),
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
    return token;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
};

export const getResetPasswordToken = async (email: string) => {
  try {
    const t = await db.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
};
export async function sendResetPasswordEmail(email: string, token: string) {
  const sender = new EmailService();
  const link = `http://localhost:3000/auth/reset-password?token=${token}`;
  await sender.sendResetPasswordEmail(email, link);
}

export async function resetPasswordAction(
  token: string,
  data: ResetPasswordSchemaType
): Promise<FormResponse> {
  try {
    const validate = ResetPasswordSchema.safeParse(data);
    if (!validate.success) {
      return {
        message: validate.error.errors[0].message || "Invalid password",
        success: false,
      };
    }
    const { password, confirmPassword } = validate.data;

    if (password !== confirmPassword) {
      return {
        message: "Passwords do not match",
        success: false,
      };
    }
    const tokenExists = await getResetPasswordTokenByToken(token);

    if (!tokenExists) {
      return {
        message: "Invalid token",
        success: false,
      };
    }

    // update password
    const user = await UserService.getUserByEmail(tokenExists.email, {
      name: "vvv",
    });
    if (!user) {
      return {
        message: "user may not exist or verified",
        success: false,
      };
    }
    const hashedPassword = await hashMyPassword(password);
    await db.user.update({
      where: {
        email: tokenExists.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await db.resetPasswordToken.delete({
      where: {
        id: tokenExists.id,
      },
    });

    return {
      message: "Password Updated Successfully. Redirecting ...",
      success: true,
      redirectTo: "/auth/login",
      delayBeforeRedirect: 1000,
    };
  } catch (error) {
    return {
      message: "Something went wrong",
      success: false,
    };
  }
}

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const t = await db.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
    return t;
  } catch (error) {
    console.log("Error in getResetPasswordToken", error);
    return null;
  }
};
