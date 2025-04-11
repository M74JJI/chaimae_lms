import { ErrorCode, ErrorCodeType } from "@/types";
import { Prisma } from "@prisma/client";

// types/errors.ts
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
    public readonly window: string,
    customMessage: string = "Too many requests. Please slow down." // <- ADD THIS
  ) {
    super(
      ErrorCode.RATE_LIMITED,
      customMessage, // <- USE IT
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
