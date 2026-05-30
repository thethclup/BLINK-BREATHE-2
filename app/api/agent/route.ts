import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Blink Breathe Orchestrator",
    description: "Master of mindful breathing and micro-calm moments",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Blink Breathe",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent processed request",
      data: body
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Invalid request payload"
    }, {
      status: 400, headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
