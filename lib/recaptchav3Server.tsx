"server-only"

import { NextRequest } from "next/server";

export async function verifyToken(req: NextRequest, baseScore: number) {
  const {token, action} = await req.json();

  if (!token) {
    throw new Error('token is required');
  }

  if (!action) {
    throw new Error('action is required');
  }

  const params = new URLSearchParams();
  params.set('secret', process.env.RECAPTCHA_SECRET!);
  params.set('response', token);

  const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const result = await verifyResponse.json() as { success: boolean; score: number; action: string };

  if (!result.success) {
    throw new Error('verify failed');
  }

  if (!result.action !== action) {
    throw new Error('action mismatch');
  }
  
  if ((result.score ?? 0) < baseScore) {
    throw new Error('you are probably a bot');
  }

  return result;
}