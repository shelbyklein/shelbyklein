export const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function sitePath(path: string): string {
  if (!siteBasePath || !path.startsWith('/') || path.startsWith('//')) return path;
  const match = path.match(/^([^?#]*)(.*)$/)!;
  let pathname = match[1];
  if (!pathname.endsWith('/') && !/\.[^/]+$/.test(pathname)) pathname += '/';
  if (pathname === siteBasePath || pathname.startsWith(siteBasePath + '/')) return pathname + match[2];
  return siteBasePath + pathname + match[2];
}
