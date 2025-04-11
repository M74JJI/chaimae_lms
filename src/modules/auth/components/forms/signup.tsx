"use client";

import Link from "next/link";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SignupSchema } from "@/auth/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormField from "@/components/ui/form-field";
import FormResponseMessage from "@/components/ui/form-response-message";
import CaptchaBtnLoader from "@/components/ui/captcha-btn-loader";
import BeatLoader from "react-spinners/BeatLoader";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useFormHandler } from "@/hooks/useFormHandler";
import { signUp } from "@/auth/services";

/**
 * SignUpForm
 *
 * Handles new user registration with built-in validation, ReCAPTCHA v3, and feedback messaging.
 */
export const SignUpForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { form, message, loading, handleSubmit, captchaState } = useFormHandler(
    {
      schema: SignupSchema,
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: signUp,
      captcha: {
        enableCaptcha: true,
        executeRecaptcha,
        action: "credentials_signup",
        tokenExpiryMs: 120000,
      },
    }
  );

  const isLoading = loading || captchaState.validating;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="w-[350px]" noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join us today! Enter your details below to get started.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="firstName"
                placeholder="First Name"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="lastName"
                placeholder="Last Name"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="email"
                placeholder="Email Address"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                placeholder="Phone Number"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="password"
                type="password"
                placeholder="Password"
                disabled={isLoading}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                disabled={isLoading}
              />

              {message && (
                <FormResponseMessage
                  type={message.type}
                  message={message.message}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {captchaState.validating ? (
                  <CaptchaBtnLoader />
                ) : isLoading ? (
                  <BeatLoader size={10} color="#444" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?&nbsp;
              <Link
                href="/auth/signin"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
