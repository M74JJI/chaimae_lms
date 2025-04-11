"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z, type ZodSchema } from "zod";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { RateLimitError } from "@/lib/errors";
import {
  type FormResponse,
  type FormHandlerParams,
  ErrorCode,
  ErrorCodeType,
  FormMessage,
} from "@/types";

/**
 * A reusable form handler hook to streamline form submissions.
 * Includes built-in captcha verification, error mapping, and success handling.
 */
export const useFormHandler = <T extends ZodSchema, D = unknown>(
  params: FormHandlerParams<T, D>
) => {
  const captcha = params.captcha;

  // Initialize form with schema-based validation
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(params.schema),
    defaultValues: params.defaultValues,
    mode: "onTouched",
  });

  const [loading, startTransition] = useTransition();
  const [message, setMessage] = useState<FormMessage | null>(null);

  const initialCaptchaState = {
    validating: false,
    token: "",
    tokenTimestamp: Date.now(),
  };

  const [captchaState, setCaptchaState] = useState(initialCaptchaState);

  /**
   * Executes reCAPTCHA if enabled, and returns a valid token.
   */
  const refreshCaptcha = async (): Promise<string | undefined | null> => {
    if (captcha?.enableCaptcha && captcha.executeRecaptcha) {
      setCaptchaState((prev) => ({ ...prev, validating: true }));
      try {
        const token = await captcha.executeRecaptcha(
          captcha.action || "default_action"
        );
        if (!token) {
          setMessage({ message: "Error Getting Captcha", type: "error" });
          return null;
        }
        setCaptchaState({
          token,
          tokenTimestamp: Date.now(),
          validating: false,
        });
        return token;
      } catch (error) {
        console.error("Error refreshing CAPTCHA:", error);
        setMessage({ message: "Captcha verification failed", type: "error" });
        setCaptchaState((prev) => ({ ...prev, validating: false }));
        return null;
      }
    }
    return null;
  };

  /**
   * Checks whether the current captcha token is expired or invalid.
   */
  const isCaptchaInvalid = (): boolean => {
    const now = Date.now();
    const invalid =
      !captchaState.token ||
      now - captchaState.tokenTimestamp > (captcha?.tokenExpiryMs || 120000);
    if (invalid) {
      setCaptchaState(initialCaptchaState);
    }
    return invalid;
  };

  /**
   * Automatically refresh CAPTCHA token when it's invalid.
   */
  useEffect(() => {
    if (captcha?.enableCaptcha && isCaptchaInvalid()) {
      refreshCaptcha();
    }
  }, [captchaState.token, captcha?.tokenExpiryMs, captcha?.enableCaptcha]);

  /**
   * Handles form submission logic, including:
   * - Captcha validation
   * - Success/redirect flow
   * - Error and issue mapping
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    setMessage(null);
    form.clearErrors();

    let captchaToken: string | undefined | null = captchaState.token;

    if (captcha?.enableCaptcha) {
      if (!captcha.executeRecaptcha) {
        setMessage({ type: "error", message: "Captcha not available" });
        return;
      }

      if (isCaptchaInvalid()) {
        console.log("Token expired, refreshing CAPTCHA");
        captchaToken = await refreshCaptcha();
        if (!captchaToken) return;
      }
    }

    startTransition(async () => {
      try {
        const response = await params.onSubmit(data, {
          token: captchaToken || "",
          tokenExpiryMs: captcha?.tokenExpiryMs || 120000,
          action: captcha?.action,
        });

        if (response.success) {
          setMessage({ type: "success", message: response.message });
          params.onSuccess?.(response.data);

          if (response.redirectTo) {
            const redirectToUrl = response.redirectTo ?? ""; // Ensure it's a string (fallback to empty string if undefined)

            if (response.delayBeforeRedirect) {
              // Wait for the specified delay in milliseconds before redirecting
              setTimeout(() => {
                window.location.href = redirectToUrl;
              }, response.delayBeforeRedirect);
            } else {
              // No delay, redirect immediately
              window.location.href = redirectToUrl;
            }
          }
        } else {
          const errorCode = isValidErrorCode(response.code)
            ? response.code
            : ErrorCode.UNKNOWN_ERROR;

          const errorMessage = response.message || getDefaultMessage(errorCode);
          setMessage({ type: "error", message: errorMessage });

          // Handle form-level and field-level validation errors
          if (errorCode === ErrorCode.VALIDATION_ERROR) {
            if (response.issues) {
              response.issues.forEach(({ field, message }) => {
                form.setError(field as any, { message }, { shouldFocus: true });
              });
            } else if (response.field) {
              form.setError(
                response.field as any,
                { message: errorMessage },
                { shouldFocus: true }
              );
            }
          }

          params.onError?.({
            ...response,
            code: errorCode,
            message: errorMessage,
          });
        }
      } catch (error) {
        if (isRedirectError(error)) throw error;

        if (error instanceof RateLimitError) {
          setMessage({ type: "error", message: error.message });
        } else {
          const fallbackError = parseUnknownError(error);
          setMessage({ type: "error", message: fallbackError.message });
          params.onError?.(fallbackError);
        }
      }
    });
  });

  return {
    form,
    handleSubmit,
    loading,
    message,
    errors: form.formState.errors,
    captchaState,
  };
};

/**
 * Checks whether a given error code is a valid `ErrorCodeType`.
 */
const isValidErrorCode = (code?: string): code is ErrorCodeType => {
  return code
    ? Object.values(ErrorCode).includes(code as ErrorCodeType)
    : false;
};

/**
 * Returns a default error message for each `ErrorCodeType`.
 */
const getDefaultMessage = (code: ErrorCodeType) => {
  const messages: Record<ErrorCodeType, string> = {
    VALIDATION_ERROR: "Invalid form data",
    AUTH_ERROR: "Authentication failed",
    DB_ERROR: "Database error",
    NETWORK_ERROR: "Network issue",
    CONFLICT_ERROR: "Data conflict",
    RATE_LIMITED: "Too many attempts",
    INTERNAL_ERROR: "Server error",
    UNKNOWN_ERROR: "An unknown error occurred",
  };
  return messages[code];
};

/**
 * Parses unknown exceptions and returns a normalized `FormResponse`.
 */
const parseUnknownError = (error: unknown): FormResponse => ({
  success: false,
  code: ErrorCode.UNKNOWN_ERROR,
  message: error instanceof Error ? error.message : "Unknown error",
});
