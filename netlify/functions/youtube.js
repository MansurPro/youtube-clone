// Server-side proxy for the RapidAPI YouTube endpoints.
//
// The key is read from the function environment on each request, so it never
// reaches the browser. A VITE_* variable cannot do this: Vite inlines those
// into the bundle at build time, which is how the key ended up public before.
const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const RAPID_HOST = 'youtube-v31.p.rapidapi.com';

// This proxy is publicly reachable, so restrict it to the endpoints the app
// actually calls — otherwise anyone could spend our quota on arbitrary ones.
const ALLOWED_ENDPOINTS = new Set(['search', 'videos', 'channels']);

export default async (req) => {
  const key = process.env.RAPID_API_KEY;
  if (!key) {
    return Response.json(
      { error: 'RAPID_API_KEY is not set on this deploy.' },
      { status: 500 },
    );
  }

  const { pathname, search } = new URL(req.url);
  const endpoint = pathname.split('/').filter(Boolean).pop();

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return Response.json({ error: `Unsupported endpoint: ${endpoint}` }, { status: 400 });
  }

  const upstream = await fetch(`${BASE_URL}/${endpoint}${search}`, {
    headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': RAPID_HOST },
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      // The free RapidAPI tier is the binding constraint, so let the edge
      // absorb repeat requests rather than spending quota on them.
      'cache-control': 'public, max-age=300',
    },
  });
};
