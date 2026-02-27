# Ghost Labs Architecture

## Overview
Ghost Labs is a secure collaborative workspace platform that provides:
- Real-time video/audio communication via WebRTC
- Persistent Linux lab environments for each user with multiple OS options
- Collaborative access to lab environments via temporary cloudflared tunnels
- Snapshot functionality for saving and resuming work
- AI coding assistant integrated into the workspace

## Target Audience
College students (1st and 2nd year) learning programming and collaboration

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  (React + WebRTC + Monaco Editor + WebSocket Client)        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ WebSocket + REST API
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      API Gateway                             │
│              (Express.js + Socket.io)                        │
└─────┬──────────────┬──────────────┬─────────────────────────┘
      │              │              │
      │              │              │
┌─────▼─────┐  ┌────▼──────┐  ┌────▼──────────┐
│  Session  │  │Container  │  │  AI Agent     │
│  Service  │  │  Manager  │  │  Service      │
│           │  │  Service  │  │               │
└───────────┘  └─────┬─────┘  └───────────────┘
                     │
              ┌──────▼──────┐
              │   Docker    │
              │ Containers  │
              │(Linux Labs) │
              └─────────────┘
```

## Core Components

### 1. Frontend (`/frontend`)
- **Technology**: React, TypeScript, WebRTC, Socket.io-client
- **Features**:
  - Video call interface
  - Terminal emulator (xterm.js)
  - Code editor (Monaco Editor)
  - File browser
  - Snapshot management UI

### 2. Backend API Gateway (`/backend`)
- **Technology**: Node.js, Express, Socket.io
- **Responsibilities**:
  - WebSocket connection management
  - User authentication
  - Route requests to microservices
  - Real-time event broadcasting

### 3. Container Manager Service (`/services/container-manager`)
- **Technology**: Node.js, dockerode
- **Responsibilities**:
  - Create/destroy Docker containers with selected OS
  - Manage container lifecycles
  - Handle file system operations
  - Create and restore snapshots (Docker commits)
  - Support multiple OS images (Alpine, Ubuntu, Debian, Fedora, Arch)

### 4. Tunnel Manager Service (`/services/tunnel-manager`)
- **Technology**: Node.js, cloudflared
- **Responsibilities**:
  - Create temporary cloudflared tunnels for each session
  - Generate public URLs for container access
  - Manage tunnel lifecycle (create/destroy)
  - No authentication required (free cloudflared service)

### 5. AI Agent Service (`/services/ai-agent`)
### 4. Tunnel Manager Service (`/services/tunnel-manager`)
- **Technology**: Node.js, cloudflared
- **Responsibilities**:
  - Create temporary cloudflared tunnels for each session
  - Generate public URLs for container access
  - Manage tunnel lifecycle (create/destroy)
  - No authentication required (free cloudflared service)

### 5. AI Agent Service (`/services/ai-agent`)
- **Technology**: Node.js, Python
- **Responsibilities**:
  - Code analysis and suggestions
  - File reading/writing
  - Simple refactoring operations
  - Integration with LLM APIs (OpenAI/local models)

### 6. Session Service (`/services/session`)
- **Technology**: Node.js, Redis (optional for now)
- **Responsibilities**:
  - Manage active sessions/rooms
  - Track users in rooms
  - Handle permissions

## Data Flow

### User Creates Session
1. User selects OS type or snapshot on homepage
2. User enters name and clicks "Create New Session"
3. Backend requests Container Manager to create container with selected OS
4. Backend requests Tunnel Manager to create cloudflared tunnel
5. Tunnel URL is generated (e.g., https://xyz.trycloudflare.com)
6. WebSocket connection established
7. User redirected to workspace with tunnel URL
8. Other users can join via tunnel URL or session ID

### Collaborative Access
1. User A shares screen/terminal with User B
2. WebSocket broadcasts terminal output to all participants
3. Input from any user forwarded to container
4. Changes synchronized in real-time

### Snapshot Save/Load
1. User requests snapshot with name/description
2. Container Manager commits container state to Docker image
3. Snapshot metadata saved with unique ID
4. User can later select snapshot when creating new session
5. Container Manager creates new container from snapshot image

## Technology Stack

### Frontend
- React 18
- TypeScript
- Socket.io-client
- xterm.js (terminal emulator)
- Monaco Editor (code editor)
- WebRTC (video/audio)

### Backend
- Node.js 18+
- Express.js
- Socket.io
- JWT for authentication

### Container Platform
- Docker
- Alpine Linux (lightweight base image)
- Node.js/Python pre-installed

### AI Agent
- Node.js
- Express
- Integration with OpenAI API or local LLMs

### Database
- SQLite (simple start, can upgrade to PostgreSQL)
- Store: users, sessions, snapshots metadata

## Security Considerations

1. **Container Isolation**: Each lab runs in isolated Docker container
2. **Resource Limits**: CPU, memory, disk limits per container
3. **Network Isolation**: Containers have limited network access
4. **Authentication**: JWT-based auth
5. **Input Validation**: Sanitize all user inputs
6. **Rate Limiting**: Prevent abuse of API endpoints

## Deployment

### Development
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev

# Services
cd services/container-manager && npm run dev
cd services/ai-agent && npm run dev
```

### Production
- Docker Compose for orchestration
- Nginx as reverse proxy
- Let's Encrypt for SSL
- Environment-based configuration

## Future Enhancements
- Kubernetes for container orchestration
- Persistent storage volumes
- Screen sharing improvements
- Collaborative cursor tracking
- Built-in chat system
- Recording sessions
