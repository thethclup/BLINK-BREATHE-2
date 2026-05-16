# Blink & Breathe 2: The Psychological Descent

Blink & Breathe 2 is a deep, psychological horror survival game set in an ever-shifting liminal nightmare where blinking allows the entities to move. It builds upon the tense foundation of its predecessor introducing new mechanics such as "Sanity Layers", "Memory Horror", and "Breathing Entities".

## Game Concept

You are trapped. 
The entities only move when you blink. However, staring for too long drains your *sanity*, causing the world to distort around you, and bringing your own deepest fears to life. 

* **Hold (Click/Space)** to keep your eyes open.
* **Release** to blink. 

Manage your **Blink Timer**, **Sanity**, and **Fear Level** simultaneously as the horror escalates. Find temporary respite in the **Safe Room**, an occasional fracture in the endless nightmare, to regain control of your breathing.

## On-Chain Horror

The game fully integrates with Base Mainnet to permanently immortalize your psychological descent:

1. **ERC-8021 Transaction Attribution**: Records builder and game origins on-chain.
2. **ERC-8004 Trustless Agents (`Blink Breathe Orchestrator`)**: Interacts with automated mindful breathing logic via the `.well-known/agent-card.json` standard.
3. **Record Nightmare On-Chain**: Once the entities ultimately catch you, broadcast a permanent verification of your survival run to the void.

## Development

This project is built using:
- **React 19 & Vite**
- **Framer Motion** for UI/horror animations
- **TypeScript & Tailwind CSS**
- **HTML5 Canvas** for the high-performance generative liminal space
- **Express.js** as an backend to host MCP endpoints for AI Agents.

### Agent Architecture
The backend serves an ERC-8004 compatible agent discovery endpoint at `/.well-known/agent-card.json`.
The orchestrator MCP logic runs at `/api/mcp`.

## Setup
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run start
```
