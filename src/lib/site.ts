export const appBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const siteName = '競賽演算法筆記';
export const homeLabel = '總覽';

export function withBase(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${appBase}${normalized}` || '/';
}

export function absoluteAppUrl(path = '/') {
  const site = import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321/';
  return new URL(withBase(path), site).toString();
}
