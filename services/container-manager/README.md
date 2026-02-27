# Container Manager Service

Manages Docker containers for user workspaces.

## Features

- Create/destroy Docker containers
- Execute commands in containers
- Create snapshots (Docker commits)
- Resource management

## API Endpoints

- `POST /containers/create` - Create new container
- `POST /containers/:id/exec` - Execute command
- `POST /containers/:id/snapshot` - Create snapshot
- `POST /containers/:id/stop` - Stop container
- `GET /containers` - List active containers
- `GET /health` - Health check

## Setup

```bash
npm install
npm run dev
```

Requires Docker to be installed and running.
