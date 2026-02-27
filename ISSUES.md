# GitHub Issues to Create

Copy these into GitHub Issues for contributors to work on.

(Updated with cloudflared tunnel support and OS selection features)

---

## Issue #1: Integrate xterm.js for Terminal Emulator

**Labels:** `good first issue`, `frontend`, `enhancement`  
**Difficulty:** Easy

### Description
The Terminal component currently shows a placeholder. Integrate xterm.js library to create a functional terminal emulator that can display text and handle user input.

### Tasks
- [ ] Import xterm.js and xterm-addon-fit in `frontend/src/components/Terminal.tsx`
- [ ] Initialize the terminal in the useEffect hook
- [ ] Set up terminal styling (dark theme)
- [ ] Make the terminal fit the container using FitAddon
- [ ] Add placeholder text showing it's ready

### Resources
- [xterm.js documentation](https://xtermjs.org/)
- Look at `frontend/src/components/Terminal.tsx`

### Acceptance Criteria
- Terminal renders with dark theme
- Terminal fills the available container space
- Can display text (manual test by modifying code)

---

## Issue #2: Integrate Monaco Editor for Code Editing

**Labels:** `good first issue`, `frontend`, `enhancement`  
**Difficulty:** Easy

### Description
Replace the placeholder in CodeEditor component with Microsoft's Monaco Editor (the editor used in VS Code).

### Tasks
- [ ] Use `@monaco-editor/react` package (already in package.json)
- [ ] Set up Monaco editor with VS Code dark theme
- [ ] Handle file content loading from props
- [ ] Add language detection based on file extension
- [ ] Add basic editor options (line numbers, minimap, etc.)

### Resources
- [Monaco Editor React documentation](https://github.com/suren-atoyan/monaco-react)
- File: `frontend/src/components/CodeEditor.tsx`

### Acceptance Criteria
- Editor displays when file is selected
- Syntax highlighting works for common languages (JS, Python, etc.)
- Editor has dark theme matching the app

---

## Issue #3: Implement File Tree Component

**Labels:** `frontend`, `enhancement`  
**Difficulty:** Medium

### Description
The FileExplorer component currently shows a flat list. Implement a proper file tree that supports nested folders.

### Tasks
- [ ] Create recursive tree rendering for folders and files
- [ ] Add expand/collapse functionality for folders (use state)
- [ ] Show appropriate icons for files and folders (📁 📄)
- [ ] Style the tree with indentation for nested items
- [ ] Add hover effects
- [ ] (Stretch) Connect to backend API to fetch actual file structure

### Files
- `frontend/src/components/FileExplorer.tsx`

### Acceptance Criteria
- Folders can be expanded/collapsed
- Files are displayed under their parent folders
- Clicking a file calls the onFileSelect prop
- Tree is visually clear with proper indentation

---

## Issue #4: Add WebRTC Video/Audio Communication

**Labels:** `frontend`, `webrtc`, `enhancement`  
**Difficulty:** Medium

### Description
Implement basic WebRTC functionality for peer-to-peer video/audio calls between participants.

### Tasks
- [ ] Request camera/microphone permissions on component mount
- [ ] Display local video stream
- [ ] Create peer connections using RTCPeerConnection
- [ ] Use the existing Socket.io signaling (check backend socket handlers)
- [ ] Handle WebRTC offers, answers, and ICE candidates
- [ ] Display remote video streams in a grid
- [ ] Add mute/unmute toggle buttons
- [ ] Add camera on/off toggle

### Files
- `frontend/src/components/VideoCall.tsx`
- Backend already has signaling: `backend/src/socket/index.js`

### Resources
- [WebRTC documentation](https://webrtc.org/getting-started/overview)
- [Simple WebRTC example](https://webrtc.github.io/samples/)

### Acceptance Criteria
- Local video displays when permissions granted
- Can connect to another user and see their video
- Mute/unmute buttons work
- Minimal latency for good user experience

---

## Issue #5: Connect Terminal to Container via WebSocket

**Labels:** `frontend`, `backend`, `websocket`  
**Difficulty:** Medium

### Description
Create a real-time connection between the frontend terminal and the Docker container terminal.

### Tasks
- [ ] Set up WebSocket event handlers in Terminal component for `terminal-input` and `terminal-output`
- [ ] Emit terminal input to backend via Socket.io when user types
- [ ] Receive terminal output from backend and display in xterm
- [ ] Update backend socket handler to forward commands to container
- [ ] Connect backend to container's stdin/stdout using dockerode
- [ ] Handle terminal resize events
- [ ] Add error handling for disconnections

### Files
- `frontend/src/components/Terminal.tsx`
- `backend/src/socket/index.js`
- `services/container-manager/src/index.js`

### Acceptance Criteria
- Can type commands in frontend terminal
- Commands execute in Docker container
- Output appears in real-time in terminal
- Multiple users see the same terminal output

---

## Issue #6: Implement User Authentication (Basic)

**Labels:** `backend`, `security`, `enhancement`  
**Difficulty:** Easy

### Description
Add basic JWT-based authentication for users joining sessions.

### Tasks
- [ ] Create login/signup forms on homepage
- [ ] Create new route file `backend/src/routes/auth.js`
- [ ] Implement register endpoint (store username + hashed password)
- [ ] Implement login endpoint (return JWT token)
- [ ] Add middleware to verify JWT tokens
- [ ] Store user info in session when authenticated
- [ ] Update frontend to store token in localStorage
- [ ] Add username display in workspace header
- [ ] Protect session routes with auth middleware

### Files
- Create `backend/src/routes/auth.js`
- Update `frontend/src/pages/HomePage.tsx`
- Create `backend/src/middleware/auth.js`

### Resources
- [JWT documentation](https://jwt.io/)
- [bcryptjs for password hashing](https://www.npmjs.com/package/bcryptjs)

### Acceptance Criteria
- Users can register with username/password
- Users can login and receive JWT token
- Token is required to create/join sessions
- Username displays in workspace

---

## Issue #7: Create Snapshot Save/Restore UI

**Labels:** `frontend`, `feature`  
**Difficulty:** Medium

### Description
Build the UI for saving and restoring container snapshots.

### Tasks
- [ ] Create new component `SnapshotManager.tsx`
- [ ] Add button in workspace header to open snapshot modal
- [ ] Create modal/sidebar for snapshot management
- [ ] List existing snapshots with name, date, description
- [ ] Add form to create new snapshot (name + description inputs)
- [ ] Implement save snapshot functionality (call backend API)
- [ ] Implement restore snapshot functionality
- [ ] Add loading states during snapshot operations
- [ ] Add success/error notifications
- [ ] Style the component to match app theme

### Files
- Create `frontend/src/components/SnapshotManager.tsx`
- Update `frontend/src/pages/WorkspacePage.tsx`

### Acceptance Criteria
- Can save workspace as snapshot with name
- Snapshots list displays saved snapshots
- Can restore from a saved snapshot
- UI provides feedback during operations

---

## Issue #8: Add Simple Chat Feature

**Labels:** `good first issue`, `frontend`, `feature`  
**Difficulty:** Easy

### Description
Add a text chat feature so participants can communicate without using voice.

### Tasks
- [ ] Create a new Chat component (similar structure to AIAssistant)
- [ ] Add Socket.io events for `chat-message` (send/receive)
- [ ] Show message history in scrollable area
- [ ] Display username with each message
- [ ] Add timestamp to messages
- [ ] Update backend socket handler with chat events
- [ ] Style messages (sender vs others)
- [ ] Add chat to workspace right panel
- [ ] Auto-scroll to latest message

### Files
- Create `frontend/src/components/Chat.tsx`
- Update `backend/src/socket/index.js`
- Update `frontend/src/pages/WorkspacePage.tsx`

### Acceptance Criteria
- Can send messages that appear for all users
- Messages show username and timestamp
- Chat history is maintained during session
- UI is clean and easy to use

---

## Issue #9: Integrate OpenAI API for AI Assistant

**Labels:** `backend`, `ai`, `enhancement`  
**Difficulty:** Medium

### Description
Connect the AI Assistant to OpenAI's API for actual code suggestions and help.

### Tasks
- [ ] Set up OpenAI API key in environment variables
- [ ] Install OpenAI SDK: `npm install openai`
- [ ] Implement chat completion API call in `/chat` endpoint
- [ ] Handle streaming responses (optional)
- [ ] Add context from current file being edited
- [ ] Implement error handling for API failures (rate limits, etc.)
- [ ] Add simple prompt engineering for code assistance
- [ ] Test with various coding questions
- [ ] Add fallback message when API key not configured

### Files
- `services/ai-agent/src/index.js`
- `services/ai-agent/.env.example`

### Resources
- [OpenAI API documentation](https://platform.openai.com/docs)
- [OpenAI Node.js library](https://github.com/openai/openai-node)

### Acceptance Criteria
- AI responds to questions when API key is configured
- Responses are relevant to coding/programming
- Error handling works gracefully
- Instructions added to README for API key setup

---

## Issue #10: Add Database Integration with SQLite

**Labels:** `backend`, `database`, `enhancement`  
**Difficulty:** Medium

### Description
Replace in-memory storage with SQLite database for persistent data storage.

### Tasks
- [ ] Create database schema for users, sessions, snapshots
- [ ] Create `backend/src/db/schema.sql` with table definitions
- [ ] Create `backend/src/db/index.js` for database initialization
- [ ] Implement database connection on server startup
- [ ] Update session routes to use database instead of Map
- [ ] Add functions for CRUD operations (create, read, update, delete)
- [ ] Add database migrations support (optional)
- [ ] Update .gitignore to exclude database files
- [ ] Add error handling for database operations
- [ ] Test all endpoints with database

### Files
- Create `backend/src/db/schema.sql`
- Create `backend/src/db/index.js`
- Update `backend/src/routes/session.js`

### Resources
- [better-sqlite3 documentation](https://github.com/WiseLibs/better-sqlite3)

### Acceptance Criteria
- Database file is created on first run
- Sessions persist across server restarts
- All CRUD operations work correctly
- No SQL injection vulnerabilities

---

## Issue #11: Build and Test OS Images

**Labels:** `good first issue`, `docker`, `testing`  
**Difficulty:** Easy

### Description
Build all available OS images (Alpine, Ubuntu, Debian, Fedora, Arch) and create a test script to verify they work correctly.

### Tasks
- [ ] Run the `build-all.sh` script in `docker/os-images`
- [ ] Test each OS image by creating a container
- [ ] Verify basic tools are installed (git, vim, node, python)
- [ ] Create a test script `test-images.sh` that validates OS images
- [ ] Document any build errors or issues
- [ ] Add image size information to documentation

### Files
- `docker/os-images/build-all.sh`
- Create `docker/os-images/test-images.sh`

### Acceptance Criteria
- All OS images build successfully
- Test script validates each image
- Documentation updated with image sizes
- No missing dependencies

---

## Issue #12: Test Cloudflared Tunnel Creation

**Labels:** `backend`, `testing`, `networking`  
**Difficulty:** Medium

### Description
Test the tunnel manager service end-to-end and improve error handling and logging.

### Tasks
- [ ] Install cloudflared on your system
- [ ] Start the tunnel manager service
- [ ] Test tunnel creation with curl/Postman
- [ ] Test tunnel closing and cleanup
- [ ] Add better error messages for common failures
- [ ] Add timeout handling for tunnel creation
- [ ] Test with multiple simultaneous tunnels
- [ ] Add logging for tunnel lifecycle events
- [ ] Test what happens when cloudflared is not installed

### Files
- `services/tunnel-manager/src/index.js`
- `services/tunnel-manager/README.md`

### Resources
- [Cloudflared documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)

### Acceptance Criteria
- Tunnel creates successfully and returns URL
- Error handling works for edge cases
- Logging provides useful debugging information
- Service handles multiple tunnels correctly
- Documentation includes troubleshooting section

---

## Additional Label Categories

- `good first issue` - Perfect for beginners
- `frontend` - React/UI work
- `backend` - Node.js/Express work
- `enhancement` - New features
- `bug` - Bug fixes
- `documentation` - Docs improvements
- `help wanted` - Extra attention needed

---

**Instructions for Maintainers:**
1. Create these issues in GitHub
2. Add appropriate labels
3. Assign difficulty levels
4. Link to CONTRIBUTING.md
5. Welcome new contributors!
