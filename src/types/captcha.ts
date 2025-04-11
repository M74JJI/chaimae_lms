export interface CaptchaActionOptions {
  action?: string;
  tokenExpiryMs?: number;
  token?: string;
}

export interface CaptchaOptions {
  enableCaptcha: boolean;
  executeRecaptcha?: (action?: string) => Promise<string | undefined | null>;
  action?: string;
  tokenExpiryMs?: number;
}
