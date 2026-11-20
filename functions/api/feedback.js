const DEFAULT_REPO = 'JCarrascoF/khora';
const MAX_TITLE_LEN = 150;
const MAX_MESSAGE_LEN = 4000;
const MAX_TYPE_LEN = 80;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function cleanText(value, maxLen) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return jsonResponse({ ok: false, error: 'invalid_payload' }, 400);
  }

  // Honeypot anti-spam field: bots suelen rellenarlo, humanos no lo ven
  if (typeof body.website === 'string' && body.website.trim().length > 0) {
    return jsonResponse({ ok: true }, 200);
  }

  const type = cleanText(body.type, MAX_TYPE_LEN) || 'Sugerencia o nueva idea';
  const rawTitle = cleanText(body.title, MAX_TITLE_LEN);
  const rawMessage = cleanText(body.message, MAX_MESSAGE_LEN);
  const lang = cleanText(body.lang, 10) || 'es';
  const mode = cleanText(body.mode, 20) || 'local';

  if (!rawTitle && !rawMessage) {
    return jsonResponse({ ok: false, error: 'empty_feedback' }, 400);
  }

  const token = env?.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    return jsonResponse({ ok: false, error: 'feedback_not_configured' }, 503);
  }

  const repo = cleanText(env?.GITHUB_REPO, 120) || DEFAULT_REPO;
  const issueTitle = `[Feedback] ${rawTitle || 'Feedback Khōra'}`;
  const issueBody = [
    `**${type}**`,
    '',
    rawMessage || '(Sin descripción adicional)',
    '',
    '---',
    `Khōra · lang: ${lang} · mode: ${mode} · source: anonymous-web`
  ].join('\n');

  let ghRes;
  try {
    ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'khora-feedback-pages-function',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ['feedback']
      })
    });
  } catch {
    return jsonResponse({ ok: false, error: 'upstream_unreachable' }, 502);
  }

  if (!ghRes.ok) {
    return jsonResponse({ ok: false, error: 'upstream_rejected', status: ghRes.status }, 502);
  }

  return jsonResponse({ ok: true }, 201);
}
