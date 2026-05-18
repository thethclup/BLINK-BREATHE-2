import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Blink Breathe Orchestrator - Agent Info Endpoint
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Blink Breathe Orchestrator",
      description: "Master of mindful breathing and micro-calm moments",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Blink Breathe",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // MCP GET Endpoint
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Blink Breathe MCP Endpoint",
      status: "active",
      description: "Active MCP server for Blink Breathe Orchestrator",
      capabilities: ["blink-breathe-synchronization", "mindful-breathing-automation", "calm-state-management"],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST Endpoint
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};

      // Standard MCP Protocol Check (JSON-RPC)
      if (body.jsonrpc === "2.0") {
        const { method, params, id } = body;

        if (method === "initialize") {
          return res.json({
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
          return res.json({
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
          return res.json({
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
          return res.json({
            jsonrpc: "2.0",
            id,
            result: {
              [method.split('/')[0]]: []
            }
          });
        }
      }

      // Legacy commands
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
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Blink Breathe Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process breathing command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
