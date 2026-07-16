/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly PUBLIC_API_URL?: string;
  readonly PUBLIC_AUTH_MODE?: 'supabase' | 'mock';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_BASE__: string;
