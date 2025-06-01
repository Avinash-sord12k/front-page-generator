import { NextRequest, NextResponse } from "next/server";
import { fillPdf } from "./gen_service";

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {

  const body = await req.json();

  if (!body?.meta || !body?.data) {
    return NextResponse.json({
      error: 'Invalid request body'
    });
  }

  const { url } = await fillPdf(body.meta, body.data);


  return NextResponse.json({
    url
  });
}