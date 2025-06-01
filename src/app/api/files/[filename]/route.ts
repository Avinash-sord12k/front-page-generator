import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import os from 'os';
import { join } from "path";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const url = new URL(req.url!);
  const filename = url.pathname.split('/').pop() as string;

  if (typeof filename !== "string") return NextResponse.json({
    error: "Invalid file"
  })

  const filePath = join(os.tmpdir(), filename);

  try {

    const fileContent = await readFile(filePath);

    return new Response(new Uint8Array(fileContent), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/pdf',
      },
    });

  } catch {
    // res.status(404).end("File not found");
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
