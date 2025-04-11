"use client";

import React from "react";
import { signIn } from "next-auth/react";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useAuthProviders } from "@/auth/hooks";
import { availableProviders } from "@/auth/lib";

/**
 * OAuthSignInOptions Component
 *
 * Provides a Call-To-Action UI for signing in with third-party OAuth providers (Google, GitHub, etc.).
 * Dynamically renders available providers and handles sign-in through NextAuth.js.
 */
export default function OAuthSignInOptions() {
  const providers = useAuthProviders();

  /**
   * Initiates the sign-in flow using the selected OAuth provider.
   * Falls back to the default redirect URL upon successful login.
   */
  const handleSignIn = async (provider: availableProviders) => {
    try {
      await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Divider with 'or' text */}
      <div className="flex items-center justify-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
          or
        </span>
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>

      {/* OAuth Providers */}
      <div className="flex items-center justify-center gap-5 p-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSignIn(provider.id)}
            className="w-full h-12 rounded-full flex justify-center items-center border cursor-pointer transition-all duration-200 ease-in-out hover:shadow-2xl focus:outline-none focus:ring-2"
            aria-label={`Continue with ${provider.name}`}
          >
            <provider.Icon aria-hidden="true" />
            <span className="sr-only">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
