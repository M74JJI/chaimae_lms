import Link from "next/link";

import { Button } from "@/components/ui/button";

type VerifyRequestProps = {
  searchParams: Record<string, string | null | number>;
};
/**
 * VerifyRequestPage
 *
 * Displays a message prompting the user to check their email for a sign-in link.
 * If an email address is present in the query string, it will be displayed dynamically.
 * A button is provided for the user to navigate back to the sign-in page.
 */
export default function VerifyRequestPage({
  searchParams,
}: VerifyRequestProps) {
  const email = searchParams?.email;

  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Check your email
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a sign-in link to your email address.
            {email && (
              <span
                className="block mt-1 text-sky-600 font-semibold text-base"
                aria-live="polite"
              >
                {email}
              </span>
            )}
          </p>
        </div>

        {/* Button to go back to sign-in */}
        <Button asChild className="w-full">
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
