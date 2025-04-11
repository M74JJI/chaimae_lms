"use client";

import BeatLoader from "react-spinners/BeatLoader";

import { Button } from "@/components/ui/button";
import FormResponseMessage from "@/components/ui/form-response-message";
import FormField from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { resetPasswordAction } from "@/auth/services";
import { useFormHandler } from "@/hooks/useFormHandler";
import { ResetPasswordSchema } from "@/auth/schemas";

/**
 * ResetPasswordForm
 *
 * A form that allows users to reset their password using a token provided via email.
 * The form validates the passwords and sends the reset request upon submission.
 */
export default function ResetPasswordForm({ token }: { token?: string }) {
  const { loading, handleSubmit, form, message } = useFormHandler({
    schema: ResetPasswordSchema,
    onSubmit: async (data) => {
      if (!token) return { message: "No Token Found", success: false };
      return await resetPasswordAction(token, data);
    },
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="w-[350px] relative overflow-hidden ">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter a new password for your account to complete the reset process.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4">
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  type="password"
                  placeholder="New Password"
                  disabled={loading}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  disabled={loading}
                />
                {message && (
                  <FormResponseMessage
                    type={message.type}
                    message={message.message}
                  />
                )}
                <Button disabled={loading} type="submit" className="w-full ">
                  {loading ? (
                    <BeatLoader size={10} color="#444" />
                  ) : (
                    "Update Your Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
