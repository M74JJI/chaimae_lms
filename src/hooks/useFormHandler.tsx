"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z, type ZodSchema } from "zod";

import { isRedirectError } from "next/dist/client/components/redirect-error";

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
   * Handles form submission logic, including:
   * - Captcha validation
   * - Success/redirect flow
   * - Error and issue mapping
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    setMessage(null);
    form.clearErrors();

    let captchaToken: string | undefined | null = captchaState.token;

    startTransition(async () => {
      try {
        const response = await params.onSubmit(data);

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
        else {
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
