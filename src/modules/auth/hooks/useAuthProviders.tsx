"use client";

import { useMemo } from "react";
import {
  GoogleIcon,
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  TwitterIcon,
} from "@/auth/components/icons";
import { availableProviders } from "@/auth/lib";

/**
 * Custom hook that returns a list of available OAuth providers.
 *
 * This hook dynamically generates the list of authentication providers
 * with their respective names, ids, and icons.
 */
export const useAuthProviders = () => {
  const providers: {
    name: string;
    id: availableProviders;
    Icon: any;
  }[] = useMemo(() => {
    return [
      {
        name: "Google",
        id: "google",
        Icon: GoogleIcon,
      },
      {
        name: "Github",
        id: "github",
        Icon: GithubIcon,
      },
      {
        name: "Facebook",
        id: "facebook",
        Icon: FacebookIcon,
      },
      {
        name: "Discord",
        id: "discord",
        Icon: DiscordIcon,
      },
      {
        name: "Twitter",
        id: "twitter",
        Icon: TwitterIcon,
      },
    ];
  }, []);

  return providers;
};
