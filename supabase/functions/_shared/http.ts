const configuredOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? 'http://localhost:4321')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function corsHeaders(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const allowed = configuredOrigins.includes(origin) ? origin : (configuredOrigins[0] ?? '');
  return {
    'access-control-allow-origin': allowed,
    'access-control-allow-headers':
      'authorization, content-type, idempotency-key, x-callback-signature',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-max-age': '86400',
    vary: 'Origin'
  };
}

export function json(request: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'content-type': 'application/json; charset=utf-8' }
  });
}

export function assertOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && !configuredOrigins.includes(origin)) throw new Error('origin_not_allowed');
}
