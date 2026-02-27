# 🚀 Ghost Labs

<p align="center">
  <img src="Commit31.png" alt="Ghost Labs Banner" width="800"/>
</p>

## Secure Collaborative Workspace with Persistent Linux Labs + AI Agent

Ghost Labs is an open-source platform that provides real-time collaborative workspaces with persistent Linux environments, designed to help students learn programming and collaboration skills.

### ✨ Features

- **🖥️ Persistent Linux Labs**: Lightweight Docker containers with multiple OS options (Alpine, Ubuntu, Debian, Fedora, Arch)
- **🤝 Real-time Collaboration**: Share and access workspaces together via WebSocket
- **🌐 Secure Tunnel Access**: Automatic cloudflared tunnel creation for each session
- **🎥 Video Communication**: Built-in WebRTC video/audio calls
- **💻 Code Editor**: Monaco Editor integration (VS Code editor)
- **🖥️ Terminal Access**: Full terminal access via xterm.js
- **💾 Snapshots**: Save and restore workspace states
- **🤖 AI Assistant**: Coding help powered by AI (OpenAI integration ready)

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Container   │
│   (React)   │     │  (Express)  │     │   Manager    │
└─────────────┘     └─────────────┘     └──────────────┘
                            │
                            ├──────────▶ ┌──────────────┐
                            │            │   Tunnel     │
                            │            │   Manager    │
                            │            └──────────────┘
                            │                    │
                            ├──────────▶ ┌──────────────┐
                            │            │  AI Agent    │
                            │            │   Service    │
                            │            └──────────────┘
                            │
                            └──────────▶ Docker Containers
                                         (Linux Labs)
                                               │
                                         Cloudflared Tunnels
                                         (Public Access)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git
- cloudflared (for tunnel functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Ghost-Labs.git
   cd Ghost-Labs
   ```

2. **Install cloudflared**
   
   **Linux:**
   ```bash
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```
   
   **macOS:**
   ```bash
   brew install cloudflare/cloudflare/cloudflared
   ```
   
   **Windows:** Download from [cloudflared releases](https://github.com/cloudflare/cloudflared/releases)

3. **Build OS workspace images**
   ```bash
   cd docker/os-images
   chmod +x build-all.sh
   ./build-all.sh
   cd ../..
   ```

4. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Container Manager: http://localhost:5001
   - AI Agent: http://localhost:5002
   - Tunnel Manager: http://localhost:5003

### Manual Setup (Development)

If you prefer to run services individually:

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Container Manager
cd services/container-manager
npm install
npm run dev

# AI Agent
cd services/ai-agent
npm install
npm run dev
```

## 📁 Project Structure

```
Ghost-Labs/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom hooks
│   └── package.json
├── backend/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   └── socket/         # Socket.io handlers
│   └── package.json
├── services/
│   ├── container-manager/  # Docker container management
│   ├── tunnel-manager/     # Cloudflared tunnel management
│   └── ai-agent/           # AI assistant service
├── docker/
│   ├── os-images/          # Multiple OS Dockerfiles
│   └── workspace/          # Default Alpine workspace
├── docker-compose.yml
├── ARCHITECTURE.md         # Architecture documentation
└── CONTRIBUTING.md         # Contribution guidelines
```

## 🎯 Use Cases

- **Programming Education**: Teachers create sessions, students join via tunnel URL
- **Team Collaboration**: Developers pair program in real-time with OS choice
- **Code Reviews**: Review code together with live discussions
- **Workshops**: Conduct hands-on programming workshops with persistent environments
- **Interview Practice**: Technical interview preparation with snapshot save/resume

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Socket.io-client
- xterm.js (terminal)
- Monaco Editor (code editor)
- WebRTC (video/audio)

### Backend
- Node.js 18
- Express.js
- Socket.io
- JWT authentication
- SQLite database

### Infrastructure
- Docker (containerization)
- Multiple Linux distributions (Alpine, Ubuntu, Debian, Fedora, Arch)
- dockerode (Docker API)
- cloudflared (secure tunneling)

## 🤝 Contributing

We welcome contributions from developers of all skill levels! This project is specifically designed to be beginner-friendly.

Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for:
- 12 beginner-friendly issues to get started
- Development setup guide
- Code style guidelines
- Git workflow

### Good First Issues

1. Integrate xterm.js for terminal emulator
2. Add Monaco Editor for code editing
3. Implement file tree component
4. Add WebRTC video communication
5. Create snapshot save/restore UI
6. Add simple chat feature
7. Implement basic authentication
8. Integrate OpenAI API
9. Add database with SQLite
10. Connect terminal to Docker container
11. Build and test OS images
12. Test cloudflared tunnel creation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for college students learning web development
- Inspired by VS Code Live Share and collaborative coding tools
- Uses open-source technologies

## 📧 Contact

- Create an issue for bug reports or feature requests
- Check existing issues before creating new ones

---

**Made with ❤️ for the open-source community**
