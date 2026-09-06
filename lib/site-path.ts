export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export function sitePath(path: string): string {
  if (!staticExport || !path.startsWith('/') || path.startsWith('//')) return path;
  const match = path.match(/^([^?#]*)(.*)$/)!;
  let pathname = match[1];
  if (!pathname.endsWith('/') && !/\.[^/]+$/.test(pathname)) pathname += '/';
  if (!siteBasePath || pathname === siteBasePath || pathname.startsWith(siteBasePath + '/')) return pathname + match[2];
  return siteBasePath + pathname + match[2];
}
