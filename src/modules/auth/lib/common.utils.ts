import slugify from "slugify";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";

export function extractName(fullName: string | null | undefined = ""): {
  firstName: string;
  lastName: string;
} {
  const parts = (fullName ?? "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}
