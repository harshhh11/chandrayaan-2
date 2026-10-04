import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "ONLINE",
    service: "EDOLUS Chandrayaan-2 Lunar Engine",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    sensors: ["OHRC", "TMC-2", "IIRS"],
    pipeline_ready: true,
    platform: "Vercel Edge / Serverless"
  });
}
