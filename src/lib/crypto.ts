import { createHash } from "crypto";

export async function hash(data: string): Promise<string> {
  return createHash("sha256").update(data).digest("hex").substring(0, 32); // Return first 32 chars of hash
}
