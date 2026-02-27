# Ghost Labs Frontend

React-based frontend for the Ghost Labs collaborative workspace platform.

## Features

- Real-time video/audio communication
- Terminal emulator for Linux labs
- Code editor with syntax highlighting
- File explorer
- AI assistant integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Terminal.tsx
│   ├── CodeEditor.tsx
│   ├── FileExplorer.tsx
│   ├── VideoCall.tsx
│   └── AIAssistant.tsx
├── pages/          # Page components
│   ├── HomePage.tsx
│   └── WorkspacePage.tsx
├── hooks/          # Custom React hooks
│   └── useSocket.ts
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## TODO - Integration Tasks

- [ ] Integrate xterm.js for terminal emulator
- [ ] Integrate Monaco Editor for code editing
- [ ] Implement WebRTC for video/audio
- [ ] Connect Socket.io to backend
- [ ] Add file upload/download functionality
- [ ] Implement snapshot save/restore UI
