import { Metadata } from "next";
import ForgotPasswordForm from "@/modules/auth/components/forms/forgot-password";
import AuthSide from "@/modules/auth/components/shared/auth-side";

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
    <main>
      <section className="p-0 flex items-center relative overflow-hidden h-[calc(100vh-5rem)]">
        <div className="container mx-auo">
          <div className="flex flex-wrap -mx-2">
            <AuthSide />
            <div className="w-full lg:w-1/2 mx-auto flex items-center justify-center px-2 lg:px-12">
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
