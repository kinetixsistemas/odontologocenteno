/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_BASE_URL?: string;
  readonly PUBLIC_API_KEY?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly PUBLIC_FORM_MODE?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_FORM_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  trackEvent?: (name: string, params?: Record<string, unknown>) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
