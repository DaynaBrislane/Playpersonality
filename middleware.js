export default function middleware(request) {
  const auth = request.headers.get('authorization');

  if (!auth || !isValidAuth(auth)) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Play Personality"',
      },
    });
  }
}

function isValidAuth(auth) {
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic') return false;
  const decoded = atob(encoded);
  const [, pass] = decoded.split(':');
  return pass === process.env.SITE_PASSWORD;
}

export const config = {
  matcher: '/(.*)',
};
