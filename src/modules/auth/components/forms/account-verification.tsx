"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import FormResponseMessage from "@/components/ui/form-response-message";

import BarLoader from "react-spinners/BarLoader";

import { verifyUserAccount } from "@/auth/services";
import { FormMessage } from "@/types";

/**
 * AccountVerificationForm
 *
 * Verifies a user's email address using a token from the URL query string.
 * On mount, it sends the token to the backend and displays a success or error message.
 */
export default function AccountVerificationForm({ token }: { token?: string }) {
  const [message, setMessage] = useState<FormMessage | null>(null);

  const handleAccountVerification = useCallback(async () => {
    const res = await verifyUserAccount(token);
    setMessage({
      type: res.success ? "success" : "error",
      message: res.message,
    });
  }, [token]);

  useEffect(() => {
    if (token) {
      handleAccountVerification();
    } else {
      setMessage({
        type: "error",
        message:
          "Verification failed. The token provided is missing or invalid. Please retry or contact support if the issue persists.",
      });
    }
  }, [token, handleAccountVerification]);

  const loading = !message;

  return (
    <div className="flex flex-col items-center space-y-4 text-center max-w-md w-full mx-auto">
      {loading ? (
        <>
          <BarLoader color="#fff" width={200} />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying your account, please wait...
          </p>
        </>
      ) : (
        <>
          <FormResponseMessage {...message} />

          {message.type === "success" && (
            <p className="text-sm text-muted-foreground">
              Your email has been verified successfully. You may now sign in to
              continue.
            </p>
          )}

          <Link href="/auth/signin" className="w-full">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </>
      )}
    </div>
  );
}
