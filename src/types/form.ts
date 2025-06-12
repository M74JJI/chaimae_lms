import { z, ZodSchema } from "zod";
import { ErrorCodeType } from "./errors";

export type FormResponse<T = unknown> = {
  success: boolean;
  message: string;
  code?: ErrorCodeType;
  data?: T;
  redirectTo?: string;
  delayBeforeRedirect?: number;
  field?: string;
  issues?: { field: string; message: string }[];
};

export type FormMessage = {
  type: "success" | "error" | "warning";
  message: string;
};

export type FormHandlerParams<T extends ZodSchema, D = unknown> = {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => Promise<FormResponse<D>>;
  onSuccess?: (data?: D) => void;
  onError?: (error: FormResponse<unknown>) => void;
};
