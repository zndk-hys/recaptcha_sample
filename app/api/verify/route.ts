import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {token} = await req.json();

  if (!token) {
    return NextResponse.json({status: 'error', message: 'token required'});
  }

  const params = new URLSearchParams();
  params.set('secret', process.env.RECAPTCHA_SECRET!);
  params.set('response', token);

  const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const result = await verifyResponse.json() as { success: boolean; score?: number; };

  if (!result.success || (result.score ?? 0) < 0.7) {
    return NextResponse.json({status: 'error', message: 'invalid token'});
  }

  return NextResponse.json({status: 'ok'});
}