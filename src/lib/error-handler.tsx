import { RateLimitError } from "@/lib/errors"; // Import RateLimitError
import { ErrorCode } from "@/types"; // Your custom error codes and messages
import { ErrorMessages } from "@/types/common";

// Centralized Error Handler
export const handleServiceError = (error: any, requestId: string) => {
  // If the error is a RateLimitError, return a formatted response
  if (error instanceof RateLimitError) {
    return {
      success: false,
      code: ErrorCode.RATE_LIMITED,
      message: error.message, // Use the custom message from RateLimitError
    };
  }

  // Handle other types of errors (AuthError, ValidationError, etc.)
  if (error instanceof Error) {
    // For unexpected errors, log and return a generic internal error
    console.error("Unexpected error:", {
      meta: { requestId },
      error: error.message,
    });

    return {
      success: false,
      code: ErrorCode.INTERNAL_ERROR,
      message: ErrorMessages.INTERNAL_ERROR,
    };
  }

  // Fallback for unknown errors
  return {
    success: false,
    code: ErrorCode.UNKNOWN_ERROR,
    message: "Something went wrong. Please try again later.",
  };
};
