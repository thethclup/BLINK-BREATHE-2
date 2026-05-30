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
      name: "Blink Breathe Orchestrator",
      description: "Master of mindful breathing and micro-calm moments",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Blink Breathe",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      return res.status(200).json({
        status: "success",
        message: "Agent processed request",
        data: body
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request payload"
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
