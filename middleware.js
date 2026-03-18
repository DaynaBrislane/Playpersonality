const PASSWORD_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Play Personality</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@500&family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a1a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .bg {
      position: fixed;
      inset: 0;
      background: url('/cosmos-bg.png') center/cover no-repeat;
    }
    .card {
      position: relative;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 10px;
      width: 419px;
      max-width: calc(100vw - 40px);
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .card h1 {
      font-family: 'Lora', serif;
      font-size: 40px;
      font-weight: 500;
      line-height: 44px;
      color: #262626;
    }
    .fields {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      width: 100%;
    }
    .card input {
      width: 346px;
      max-width: 100%;
      height: 48px;
      padding: 0 14px;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      border: 1px solid rgba(0,0,0,0.2);
      border-radius: 5px;
      outline: none;
      background: #fff;
      color: #262626;
      transition: border-color 0.2s;
    }
    .card input:focus { border-color: #555BA2; }
    .card button {
      background: #555BA2;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      height: 40px;
      padding: 0 24px;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .card button:hover { background: #44498a; }
    .error {
      color: #cc3333;
      font-size: 0.85rem;
      margin-top: -8px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="card">
    <div class="fields">
      <h1>Password:</h1>
      <input type="password" id="pw" autofocus>
    </div>
    <button type="button" onclick="handleSubmit()">Let me in</button>
    <p class="error" id="err">Incorrect password</p>
  </div>
  <script>
    document.getElementById('pw').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleSubmit();
    });
    async function handleSubmit() {
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
  matcher: '/((?!cosmos-bg\\.png|assets/|favicon\\.ico).*)',
};
