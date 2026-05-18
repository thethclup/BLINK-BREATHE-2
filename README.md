# Blink & Breathe 2: The Psychological Descent

Blink & Breathe 2 is a deep, psychological horror survival game set in an ever-shifting liminal nightmare where blinking allows the entities to move. It builds upon the tense foundation of its predecessor introducing new mechanics such as "Sanity Layers", "Memory Horror", and "Breathing Entities".

[Play the Game](https://blink-breathe-2.vercel.app/)

## Game Concept

You are trapped in an ever-evolving nightmare. 
The entities only move when you blink. However, staring for too long drains your *sanity*, causing the world to distort around you, and bringing your own deepest fears to life. 

* **Hold (Click/Right-click or Space/Left-click)** to keep your eyes open and control your breathing.
* **Release** to blink. 

Manage your **Blink Timer**, **Sanity**, and **Fear Level** simultaneously as the horror escalates. Find temporary respite in the **Safe Room**, an occasional fracture in the endless nightmare, to regain control of your breathing.

## On-Chain Horror & Agent Architecture

The game fully integrates with Base Mainnet to permanently immortalize your psychological descent. It is orchestrated by the **Blink Breathe Orchestrator**, an ERC-8004 compatible AI Agent.

### Capabilities:
- blink-breathe-synchronization
- mindful-breathing-automation
- micro-pause-orchestration
- calm-state-management
- wellness-guidance
- rhythmic-breathing
- mcp-command-execution

### ERC-8004 Agent Registration:
The ERC-8004 standard manifest is securely exposed to the network to enable trustless agent discovery and automated health monitoring:
- **A2A Service**: `/.well-known/agent-card.json`
- **MCP Server**: `/api/mcp`
- **API Endpoint**: `/api/agent`

## Connecting MCP Clients
The platform exposes a standard Model Context Protocol (MCP) server over HTTPS JSON-RPC.
The MCP endpoint is located at `https://blink-breathe-2.vercel.app/api/mcp` and provides capabilities to sync the agent with external logic.

## Technical Requirements
- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Visuals:** Framer Motion, HTML5 Canvas
- **Web3 Integration:** Wagmi, Viem, Base Mainnet, SIWE
- **Serverside:** Vercel App Router / Express.js

## Local Setup
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run start
```
