import { Metadata } from "next";
import { redirect } from "next/navigation";

import ResetPasswordForm from "@/auth/components/forms/reset-password";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password page",
};

interface Props {
  searchParams: Promise<{
    token?: string;
  }>;
}
/**
 * ResetPasswordPage
 *
 * This page handles the password reset flow. It expects a `token` query parameter to be present,
 * which is used to authenticate the user's password reset request.
 * If no token is found, the user is redirected to the home page.
 */
export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) redirect("/");

  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center p-2">
      <ResetPasswordForm token={token} />
    </div>
  );
}
