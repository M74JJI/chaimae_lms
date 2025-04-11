"use client";

import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import FormResponseMessage from "../../../../components/ui/form-response-message";

import { EmailSignInLinkSchema } from "@/auth/schemas";
import { useFormHandler } from "@/hooks/useFormHandler";
import { signInWithEmailLink } from "@/auth/services";

/**
 * EmailLinkSignInForm
 *
 * A form component for passwordless sign-in using magic email links.
 * Validates email via Zod schema and handles form state using a custom form hook.
 */
export default function EmailLinkSignInForm() {
  const { loading, form, message, handleSubmit } = useFormHandler({
    schema: EmailSignInLinkSchema,
    onSubmit: signInWithEmailLink,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate autoComplete="on">
        <FormField
          name="email"
          control={form.control}
          placeholder="Email Address"
          disabled={loading}
          aria-label="Enter your email address"
        />

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Sending..." : "Sign In With Email"}
        </Button>

        {message && (
          <div className="mt-4" role="alert" aria-live="polite">
            <FormResponseMessage
              message={message.message}
              type={message.type}
            />
          </div>
        )}
      </form>
    </Form>
  );
}
