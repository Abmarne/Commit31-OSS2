# Ghost Labs - Setup Guide

## Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Ghost-Labs.git
cd Ghost-Labs
```

### 2. Install cloudflared

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

### 3. Build OS Workspace Images
```bash
cd docker/os-images
chmod +x build-all.sh
./build-all.sh
cd ../..
```

### 4. Start Everything
```bash
docker-compose up -d
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/health

## Development Setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Container Manager Setup
```bash
cd services/container-manager
npm install
cp .env.example .env
npm run dev
```

### AI Agent Setup
```bash
cd services/ai-agent
npm install
cp .env.example .env
# Optional: Add OpenAI API key to .env
npm run dev
```

### Tunnel Manager Setup
```bash
cd services/tunnel-manager
npm install
cp .env.example .env
npm run dev
```

## Docker Commands

```bash
# Build all OS images
cd docker/os-images && ./build-all.sh && cd ../..

# Or build specific OS image
docker build -t ghost-labs-workspace:ubuntu -f docker/os-images/Dockerfile.ubuntu docker/os-images

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build backend
```

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, 5001, or 5002 are in use:
1. Stop the conflicting service
2. Or change the port in respective .env file and docker-compose.yml

### Docker Permission Denied
On Linux, you may need to add your user to docker group:
```bash
sudo usermod -aG docker $USER
```
Then log out and back in.

### Container Manager Can't Connect to Docker
Make sure Docker daemon is running:
```bash
sudo systemctl start docker
```

## Environment Variables

### Backend (.env)
```
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
CONTAINER_SERVICE_URL=http://localhost:5001
AI_AGENT_SERVICE_URL=http://localhost:5002
TUNNEL_SERVICE_URL=http://localhost:5003
```

### Container Manager (.env)
```
PORT=5001
```

### Tunnel Manager (.env)
```
PORT=5003
```

### AI Agent (.env)
```
PORT=5002
OPENAI_API_KEY=your-api-key-here  # Optional
```

## First Time Contributors

1. Check [CONTRIBUTING.md](CONTRIBUTING.md) for beginner issues
2. Set up development environment using this guide
3. Pick an issue and comment that you're working on it
4. Create a feature branch and start coding!

## Need Help?

- Open an issue on GitHub
- Check existing documentation
- Look at similar implementations in the codebase
