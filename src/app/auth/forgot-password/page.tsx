import { Metadata } from "next";
import ForgotPasswordForm from "@/modules/auth/components/forms/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password page",
};

/**
 * ForgotPasswordPage
 *
 * This page handles the user's request for a password reset. It renders the
 * `ForgotPasswordForm` where users can submit their email address to request a reset link.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center p-2">
      <ForgotPasswordForm />
    </div>
  );
}
