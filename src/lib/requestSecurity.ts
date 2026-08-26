function normalizedOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isTrustedMutationOrigin(request: Request): boolean {
  const suppliedOrigin = normalizedOrigin(request.headers.get("origin"));
  if (!suppliedOrigin) return false;

  const allowedOrigins = new Set<string>();
  const requestOrigin = normalizedOrigin(request.url);
  const configuredOrigin = normalizedOrigin(process.env.NEXT_PUBLIC_APP_URL);
  if (requestOrigin) allowedOrigins.add(requestOrigin);
  if (configuredOrigin) allowedOrigins.add(configuredOrigin);

  return allowedOrigins.has(suppliedOrigin);
}
