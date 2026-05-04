import { NextResponse } from 'next/server';

const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: { message: 'Слишком много попыток. Попробуйте через 15 минут.' } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.pluginexpert.ru';

  const response = await fetch(`${strapiUrl}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
