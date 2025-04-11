"use client";

import CaptchaClientProvider from "@/providers/captcha-provider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <CaptchaClientProvider>{children}</CaptchaClientProvider>;
};

export default AuthLayout;
