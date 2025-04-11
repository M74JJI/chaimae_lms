import { Metadata } from "next";
import AccountVerificationForm from "@/modules/auth/components/forms/account-verification";

export const metadata: Metadata = {
  title: "Account Verification",
  description: "Account Verification page",
};

interface SearchParams {
  token?: string;
}

/**
 * AccountVerificationPage
 *
 * Renders the account verification form by passing the token
 * extracted from the search parameters. This form is used
 * to confirm a user's account after email-based verification.
 */
export default function AccountVerificationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = searchParams;

  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center p-2">
      <AccountVerificationForm token={token} />
    </div>
  );
}
