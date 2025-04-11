import { Prisma } from "@prisma/client";

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  DB_ERROR: "DB_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;

export class ServiceError extends Error {
  constructor(
    public readonly code: ErrorCodeType,
    public readonly message: string,
    public readonly service: string,
    public readonly originalError?: unknown,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export class RateLimitError extends ServiceError {
  constructor(
    service: string,
    public readonly limit: number,
    public readonly window: string
  ) {
    super(
      ErrorCode.RATE_LIMITED,
      "Too many requests, please try again later",
      service,
      undefined,
      { limit, window }
    );
    this.name = "RateLimitError";
  }
}

export class PrismaError extends Error {
  constructor(
    public readonly prismaCode: string,
    message: string,
    public readonly originalError: Prisma.PrismaClientKnownRequestError
  ) {
    super(message);
    this.name = "PrismaError";
  }
}
