import { verifyToken } from "@/lib/recaptchav3Server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const _result = await verifyToken(req, 0.7);
    return NextResponse.json({status: 'ok'});

  } catch(e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({status: 'error', message: e.message});
    }
  }
}