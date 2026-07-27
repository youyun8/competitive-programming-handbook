export const appBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const siteName = '競賽演算法筆記';
export const homeLabel = '總覽';

export function withBase(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${appBase}${normalized}` || '/';
}

/** 把瀏覽器路徑正規化成 withBase 產出的形式，方便和導覽表的 href 直接比較。 */
export function normalizePath(pathname: string) {
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return withSlash.startsWith(appBase) ? withSlash : `${appBase}${withSlash}`;
}

/** 去掉 base prefix，取得站內路徑（永遠以 / 開頭、以 / 結尾）。 */
export function stripBase(pathname: string) {
  const normalized = normalizePath(pathname);
  const inner = appBase ? normalized.slice(appBase.length) : normalized;
  return inner.startsWith('/') ? inner : `/${inner}`;
}

export function absoluteAppUrl(path = '/') {
  const site = import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321/';
  return new URL(withBase(path), site).toString();
}
