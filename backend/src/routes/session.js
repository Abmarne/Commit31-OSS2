import express from 'express'
import axios from 'axios'

const router = express.Router()

// In-memory session storage (replace with database later)
const sessions = new Map()

const CONTAINER_SERVICE_URL = process.env.CONTAINER_SERVICE_URL || 'http://localhost:5001'
const TUNNEL_SERVICE_URL = process.env.TUNNEL_SERVICE_URL || 'http://localhost:5003'

// Create new session
router.post('/create', async (req, res) => {
  try {
    const { osType, snapshotId, userId, username } = req.body
    const sessionId = Math.random().toString(36).substring(2, 15)
    const containerPort = 7681 // Default ttyd port for terminal access
    
    // Create container with selected OS
    const containerResponse = await axios.post(`${CONTAINER_SERVICE_URL}/containers/create`, {
      sessionId,
      userId,
      osType: osType || 'alpine',
      snapshotId: snapshotId || null,
    })
    
    if (!containerResponse.data.success) {
      throw new Error('Failed to create container')
    }
    
    const containerId = containerResponse.data.container.id
    
    // Create cloudflared tunnel for the container
    const tunnelResponse = await axios.post(`${TUNNEL_SERVICE_URL}/tunnels/create`, {
      sessionId,
      port: containerPort,
    })
    
    if (!tunnelResponse.data.success) {
      throw new Error('Failed to create tunnel')
    }
    
    const session = {
      id: sessionId,
      createdAt: new Date(),
      participants: [{ userId, username, joinedAt: new Date() }],
      containerId,
      tunnelUrl: tunnelResponse.data.tunnel.url,
      osType: osType || 'alpine',
      snapshotId: snapshotId || null,
    }
    
    sessions.set(sessionId, session)
    
    res.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error creating session:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get session info
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const session = sessions.get(sessionId)
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found',
    })
  }
  
  res.json({
    success: true,
    session,
  })
})

// Join session
router.post('/:sessionId/join', (req, res) => {
  const { sessionId } = req.params
  const { userId, username } = req.body
  
  const session = sessions.get(sessionId)
  
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found',
    })
  }
  
  session.participants.push({ userId, username, joinedAt: new Date() })
  
  res.json({
    success: true,
    session,
  })
})

// Save snapshot
router.post('/:sessionId/snapshot', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { name, description } = req.body
    
    const session = sessions.get(sessionId)
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      })
    }
    
    // Call container manager to create snapshot
    const snapshotResponse = await axios.post(
      `${CONTAINER_SERVICE_URL}/containers/${session.containerId}/snapshot`,
      { name, tag: sessionId }
    )
    
    if (!snapshotResponse.data.success) {
      throw new Error('Failed to create snapshot')
    }
    
    res.json({
      success: true,
      snapshot: {
        id: snapshotResponse.data.snapshot.imageId,
        sessionId,
        name,
        description,
        createdAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Error creating snapshot:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// List available snapshots
router.get('/snapshots', async (req, res) => {
  try {
    // TODO: Fetch from database when implemented
    // For now, return mock data
    res.json({
      success: true,
      snapshots: [],
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get available OS options
router.get('/os-options', (req, res) => {
  res.json({
    success: true,
    osOptions: [
      { id: 'alpine', name: 'Alpine Linux', description: 'Lightweight (~5MB)', icon: '🏔️' },
      { id: 'ubuntu', name: 'Ubuntu 22.04', description: 'Popular & Beginner-friendly', icon: '🟠' },
      { id: 'debian', name: 'Debian 12', description: 'Stable & Reliable', icon: '🔴' },
      { id: 'fedora', name: 'Fedora 39', description: 'Modern & Cutting-edge', icon: '🔵' },
      { id: 'arch', name: 'Arch Linux', description: 'Rolling Release', icon: '⚫' },
    ],
  })
})

export default router
