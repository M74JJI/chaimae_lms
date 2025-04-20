"use client";

import React from "react";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BeatLoader from "react-spinners/BeatLoader";

import { Button } from "@/components/ui/button";
import FormResponseMessage from "@/components/ui/form-response-message";
import FormField from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormHandler } from "@/hooks/useFormHandler";
import { Form } from "@/components/ui/form";
import CaptchaBtnLoader from "@/components/ui/captcha-btn-loader";

import { forgotPasswordAction } from "../../services";
import { ForgotPasswordSchema } from "../../schemas";

/**
 * ForgotPasswordForm
 *
 * A form component for handling password reset requests via email.
 * The form validates the email input, integrates with Google reCAPTCHA,
 * and submits the request to the backend for password reset instructions.
 */

export default function ForgotPasswordForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { loading, handleSubmit, form, message, captchaState } = useFormHandler(
    {
      schema: ForgotPasswordSchema,
      onSubmit: forgotPasswordAction,
      defaultValues: {
        email: "",
      },
      captcha: {
        enableCaptcha: true,
        executeRecaptcha,
        action: "forgotpassword_form",
        tokenExpiryMs: 120000,
      },
    }
  );

  const isLoading = captchaState.validating || loading;

  return (
    <div className="w-full relative overflow-hidden">
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  placeholder="Email Address"
                  disabled={isLoading}
                  aria-label="Enter your email address"
                />
                {message && (
                  <FormResponseMessage
                    type={message.type}
                    message={message.message}
                  />
                )}
                <Button disabled={isLoading} type="submit" className="w-full">
                  {captchaState.validating ? (
                    <CaptchaBtnLoader />
                  ) : isLoading ? (
                    <BeatLoader size={10} color="#444" />
                  ) : (
                    "Send Password Reset Link"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm w-full flex justify-end">
            <Link
              href="/auth/signin"
              className="w-full flex justify-end text-center text-sm"
            >
              <Button variant="link" className="h-4 underline">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
