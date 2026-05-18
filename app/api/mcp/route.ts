import { NextResponse } from 'next/server';

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Blink Breathe MCP Endpoint",
    status: "active",
    description: "Active MCP server for Blink Breathe Orchestrator",
    capabilities: ["blink-breathe-synchronization", "mindful-breathing-automation", "calm-state-management"],
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Standard MCP Protocol Check (JSON-RPC)
    if (body.jsonrpc === "2.0") {
      const { method, params, id } = body;

      if (method === "initialize") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
              prompts: {},
              resources: {}
            },
            serverInfo: {
              name: "Blink Breathe Orchestrator",
              version: "1.0.0"
            }
          }
        }, { headers: corsHeaders() });
      }

      if (method === "tools/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "get_race_status",
                description: "Get the current warp race status",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "start_race",
                description: "Start a warp race session",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_leaderboard",
                description: "Get the leaderboard",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "optimize_speed",
                description: "Optimize speed parameters",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_track_info",
                description: "Get information about the current track",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        }, { headers: corsHeaders() });
      }

      if (method === "tools/call") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: `Successfully executed tool: ${params?.name || 'unknown'}`
              }
            ]
          }
        }, { headers: corsHeaders() });
      }

      if (method === "prompts/list" || method === "resources/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            [method.split('/')[0]]: []
          }
        }, { headers: corsHeaders() });
      }
    }

    // Legacy / Custom Orchestrator Commands
    const { action, command, params, task } = body;
    const cmd = (action || command || task || "").toLowerCase();

    let result: any = {};

    switch (cmd) {
      case "status":
      case "ping":
        result = { 
          status: "online", 
          agent: "Blink Breathe Orchestrator",
          message: "Breathing in sync... Calm mode active" 
        };
        break;

      case "execute":
        result = {
          success: true,
          executed: params || command,
          executedAt: new Date().toISOString(),
          message: "Breathing cycle completed successfully"
        };
        break;

      case "get_info":
        result = {
          name: "Blink Breathe Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;

      default:
        result = {
          success: true,
          message: "Breath command received",
          data: body
        };
    }

    return NextResponse.json({
      status: "success",
      agent: "Blink Breathe Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: corsHeaders() });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process breathing command"
    }, { status: 400, headers: corsHeaders() });
  }
}
