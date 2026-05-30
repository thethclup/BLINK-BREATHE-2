import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Blink Breathe MCP Endpoint",
      status: "active",
      description: "Active MCP server for Blink Breathe Orchestrator",
      capabilities: ["blink-breathe-synchronization", "mindful-breathing-automation", "calm-state-management"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      // Standard MCP Protocol Check (JSON-RPC)
      if (body.jsonrpc === "2.0") {
        const { method, params, id } = body;

        if (method === "initialize") {
          return res.status(200).json({
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
          });
        }

        if (method === "tools/list") {
          return res.status(200).json({
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
          });
        }

        if (method === "tools/call") {
          return res.status(200).json({
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
          });
        }

        if (method === "prompts/list" || method === "resources/list") {
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              [method.split('/')[0]]: []
            }
          });
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

      return res.status(200).json({
        status: "success",
        agent: "Blink Breathe Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Failed to process breathing command"
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
