import { SignUpForm } from "@/modules/auth/components/forms";
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
    <div className="h-[calc(100vh-5rem)] flex items-center justify-center p-2">
      <SignUpForm />
    </div>
  );
}
