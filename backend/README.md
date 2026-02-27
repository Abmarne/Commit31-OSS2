# Ghost Labs Backend

Express.js backend with Socket.io for real-time communication.

## Features

- WebSocket support for real-time collaboration
- Session management
- REST API for session operations
- WebRTC signaling server

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Sessions

- `POST /api/sessions/create` - Create new session
- `GET /api/sessions/:sessionId` - Get session info
- `POST /api/sessions/:sessionId/join` - Join session
- `POST /api/sessions/:sessionId/snapshot` - Save snapshot

### Health Check

- `GET /health` - Server health check

## Socket.io Events

### Client -> Server

- `join-session` - Join a session room
- `terminal-input` - Send terminal input
- `code-change` - Broadcast code changes
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `webrtc-ice-candidate` - ICE candidate

### Server -> Client

- `user-joined` - User joined session
- `user-left` - User left session
- `terminal-output` - Terminal output
- `code-update` - Code update from another user
- `webrtc-offer` - Forward WebRTC offer
- `webrtc-answer` - Forward WebRTC answer
- `webrtc-ice-candidate` - Forward ICE candidate

## Project Structure

```
src/
├── routes/         # API routes
│   └── session.js
├── socket/         # Socket.io handlers
│   └── index.js
└── index.js        # Entry point
```

## TODO - Integration Tasks

- [ ] Connect to Container Manager service
- [ ] Add database integration (SQLite)
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Implement proper error handling
