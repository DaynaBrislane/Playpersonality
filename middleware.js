const PASSWORD_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Play Personality</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #FDFDFB;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .gate {
      text-align: center;
      max-width: 320px;
      width: 100%;
      padding: 0 20px;
    }
    .gate h1 {
      font-size: 1.4rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .gate p {
      font-size: 0.85rem;
      color: #999;
      margin-bottom: 28px;
    }
    .gate input {
      width: 100%;
      padding: 14px 18px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      outline: none;
      background: #fff;
      color: #1a1a1a;
      transition: border-color 0.2s;
    }
    .gate input:focus { border-color: #555BA2; }
    .gate button {
      margin-top: 16px;
      width: 100%;
      padding: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      background: #555BA2;
      color: #fff;
      border: none;
      border-radius: 28px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .gate button:hover { background: #44498a; }
    .error {
      color: #cc3333;
      font-size: 0.85rem;
      margin-top: 12px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="gate">
    <h1>Play Personality</h1>
    <p>Enter the password to continue</p>
    <form onsubmit="return handleSubmit(event)">
      <input type="password" id="pw" placeholder="Password" autofocus>
      <button type="submit">Enter</button>
    </form>
    <p class="error" id="err">Incorrect password</p>
  </div>
  <script>
    async function handleSubmit(e) {
      e.preventDefault();
      const pw = document.getElementById('pw').value;
      const res = await fetch('/__auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById('err').style.display = 'block';
        document.getElementById('pw').value = '';
        document.getElementById('pw').focus();
      }
      return false;
    }
  </script>
</body>
</html>`;

export default function middleware(request) {
  const url = new URL(request.url);

  // Handle auth POST
  if (url.pathname === '/__auth' && request.method === 'POST') {
    return handleAuth(request);
  }

  // Check for auth cookie
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(/pp_auth=([^;]+)/);

  if (match && match[1] === hashToken(process.env.SITE_PASSWORD)) {
    return; // Authenticated, continue to site
  }

  // Show password page
  return new Response(PASSWORD_PAGE, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

async function handleAuth(request) {
  const body = await request.json();

  if (body.password === process.env.SITE_PASSWORD) {
    const token = hashToken(process.env.SITE_PASSWORD);
    return new Response('OK', {
      status: 200,
      headers: {
        'Set-Cookie': `pp_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
      },
    });
  }

  return new Response('Unauthorized', { status: 401 });
}

function hashToken(password) {
  // Simple token derived from password - not cryptographic but sufficient for gating
  let hash = 0;
  const str = 'pp_' + password + '_salt';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export const config = {
  matcher: '/(.*)',
};
