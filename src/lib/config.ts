export const HOST = process.env.HOST || "http://localhost:3000";

export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
export const recaptcha_config = {
  sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  secret: process.env.RECAPTCHA_SECRET,
  project_id: "",
};
