"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import BeatLoader from "react-spinners/BeatLoader";

import { SignInSchema } from "@/auth/schemas";
import { useFormHandler } from "@/hooks/useFormHandler";

import { signIn } from "@/auth/services";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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

import EmailLinkSignInForm from "./email-link";
import AuthProvidersCTA from "./oauth-signin-options";

const SignInForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { form, handleSubmit, loading, message, captchaState } = useFormHandler(
    {
      schema: SignInSchema,
      defaultValues: { email: "", password: "" },
      onSubmit: signIn,
      captcha: {
        enableCaptcha: true,
        executeRecaptcha,
        action: "credentials_signin",
        tokenExpiryMs: 120000,
      },
    }
  );

  const isLoading = captchaState.validating || loading;

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              placeholder="Email Address"
              disabled={isLoading}
            />

            <FormField
              control={form.control}
              name="password"
              type="password"
              placeholder="Password"
              disabled={isLoading}
            />
            {message && (
              <FormResponseMessage
                type={message.type}
                message={message.message}
              />
            )}
            <Button type="submit" className="w-full ">
              {captchaState.validating ? (
                <CaptchaBtnLoader />
              ) : isLoading ? (
                <BeatLoader size={10} color="#444" />
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

/**
 * Handles both password and email-link sign-in mechanisms in a single form.
 * Automatically switches view based on query param (?email_link).
 */
export const SignInFormHandler = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determines if current mode is email-link based
  const isEmailLink = searchParams.has("email_link");

  // Toggles the mode by updating the URL query param
  const toggleMode = () =>
    replace(
      `${pathname}?${new URLSearchParams(
        isEmailLink ? {} : { email_link: "" }
      )}`,
      { scroll: false }
    );

  return (
    <div className="w-[350px] relative overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Join us today! Enter your credentials or sign in with a link.
          </CardDescription>
        </CardHeader>

        {/* Double-width container to allow horizontal slide animation */}
        <CardContent
          className={`flex transition-transform duration-500 ease-in-out ${
            isEmailLink ? "-translate-x-1/2" : "-translate-x-3"
          }`}
          style={{ width: "200%" }}
        >
          {/* Password Sign In */}
          <div className="w-1/2 p-1 flex-shrink-0">
            <SignInForm />
          </div>

          {/* Email Link Sign In (lazy loaded) */}
          <div className="w-1/2 p-1 flex-shrink-0 ml-3">
            <Suspense fallback={<div className="h-12" />}>
              <EmailLinkSignInForm />
            </Suspense>
          </div>
        </CardContent>

        {/* If User forgot Password */}
        <Link
          href="/auth/forgot-password"
          className="w-full flex justify-end text-center text-sm"
        >
          <Button variant="link" className="h-4">
            Forgot Password?&nbsp;
          </Button>
        </Link>

        {/* Toggle between modes */}
        <div className="px-3">
          <Button
            variant="secondary"
            onClick={toggleMode}
            className="w-full hover:underline"
          >
            {isEmailLink
              ? "Sign in with Password"
              : "Sign in with Email Link Instead"}
          </Button>
        </div>

        {/* Redirect to Sign Up */}
        <div className="-mt-2 text-center text-sm">
          Don't have an account?&nbsp;
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>

        {/* OAuth sign-in options */}
        <AuthProvidersCTA />
      </Card>
    </div>
  );
};
