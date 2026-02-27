export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join session room
    socket.on('join-session', (sessionId) => {
      socket.join(sessionId)
      console.log(`Socket ${socket.id} joined session ${sessionId}`)
      
      // Notify others in the room
      socket.to(sessionId).emit('user-joined', {
        socketId: socket.id,
        timestamp: new Date(),
      })
    })

    // Terminal input
    socket.on('terminal-input', ({ sessionId, data }) => {
      // Forward to container service
      socket.to(sessionId).emit('terminal-output', { data })
    })

    // Code editor changes
    socket.on('code-change', ({ sessionId, file, content }) => {
      socket.to(sessionId).emit('code-update', { file, content })
    })

    // WebRTC signaling
    socket.on('webrtc-offer', ({ sessionId, offer, to }) => {
      socket.to(to).emit('webrtc-offer', {
        offer,
        from: socket.id,
      })
    })

    socket.on('webrtc-answer', ({ sessionId, answer, to }) => {
      socket.to(to).emit('webrtc-answer', {
        answer,
        from: socket.id,
      })
    })

    socket.on('webrtc-ice-candidate', ({ sessionId, candidate, to }) => {
      socket.to(to).emit('webrtc-ice-candidate', {
        candidate,
        from: socket.id,
      })
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
      // Notify all rooms this user was in
      const rooms = Array.from(socket.rooms)
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit('user-left', {
            socketId: socket.id,
            timestamp: new Date(),
          })
        }
      })
    })
  })
}
