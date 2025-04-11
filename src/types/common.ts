import { ErrorCode } from "./errors";

export const ErrorMessages: Record<keyof typeof ErrorCode, string> = {
  VALIDATION_ERROR: "There was an error with your input.",
  AUTH_ERROR: "Invalid credentials, please try again.",
  DB_ERROR:
    "An error occurred while accessing the database. Please try again later.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  CONFLICT_ERROR: "A conflict occurred. This data already exists.",
  RATE_LIMITED: "Too many attempts. Please try again after a while.",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};
