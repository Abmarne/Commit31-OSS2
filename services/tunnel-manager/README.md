# Tunnel Manager Service

Manages temporary cloudflared tunnels for secure meeting access.

## Features

- Create temporary cloudflared tunnels for each session
- Automatic tunnel URL generation
- Tunnel lifecycle management
- No authentication required (uses free cloudflared)

## Prerequisites

- cloudflared installed on the system

### Install cloudflared

**Linux:**
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**macOS:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

**Windows:**
Download from: https://github.com/cloudflare/cloudflared/releases

## API Endpoints

- `POST /tunnels/create` - Create new tunnel (body: {sessionId, port})
- `GET /tunnels/:sessionId` - Get tunnel info
- `DELETE /tunnels/:sessionId` - Close tunnel
- `GET /tunnels` - List all active tunnels
- `GET /health` - Health check

## Setup

```bash
npm install
npm run dev
```

## How It Works

1. When a session is created, backend requests a tunnel
2. Tunnel Manager spawns cloudflared process
3. cloudflared exposes the container port via temporary URL
4. URL is returned (e.g., https://xyz.trycloudflare.com)
5. Users join via this URL
6. Tunnel is automatically closed when session ends

## Security

- Tunnels are temporary and session-specific
- No cloudflare account required
- URLs are randomly generated
- Tunnels auto-close when process exits
