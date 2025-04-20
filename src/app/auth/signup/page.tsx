import { SignUpForm } from "@/modules/auth/components/forms";
import AuthSide from "@/modules/auth/components/shared/auth-side";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up page",
};

/**
 * SignUpPage
 *
 * This page renders the sign-up form where users can create an account.
 * It uses the `SignUpForm` component to manage the user registration flow.
 */
export default function SignUpPage() {
  return (
    <main>
      <section className="p-0 flex items-center relative overflow-hidden h-[calc(100vh-5rem)]">
        <div className="container mx-auo">
          <div className="flex flex-wrap -mx-2">
            <AuthSide />
            <div className="w-full lg:w-1/2 mx-auto flex items-center justify-center px-2 lg:px-12">
              <SignUpForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
