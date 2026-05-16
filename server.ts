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
      const { action, command, params, task } = req.body || {};
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
