import { SignInFormHandler } from "@/modules/auth/components/forms";
import AuthSide from "@/modules/auth/components/shared/auth-side";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in page",
};

/**
 * SignInPage
 *
 * This page renders the sign-in form where users can input their credentials
 * to log into their accounts. It uses the `SignInFormHandler` to manage form state
 * and validation.
 */
export default function SignInPage() {
  return (
    <main>
      <section className="p-0 flex items-center relative overflow-hidden h-[calc(100vh-5rem)]">
        <div className="container mx-auo">
          <div className="flex flex-wrap -mx-2">
            <AuthSide />
            <div className="w-full lg:w-1/2 mx-auto flex items-center justify-center px-2 lg:px-12">
              <SignInFormHandler />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
