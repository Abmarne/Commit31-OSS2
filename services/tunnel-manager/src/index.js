import express from 'express'
import { spawn } from 'child_process'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5003

app.use(cors())
app.use(express.json())

// Store active tunnels
const activeTunnels = new Map()

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tunnel Manager Service is running' })
})

// Create cloudflared tunnel
app.post('/tunnels/create', async (req, res) => {
  try {
    const { sessionId, port } = req.body

    if (!sessionId || !port) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and port are required',
      })
    }

    // Check if tunnel already exists for this session
    if (activeTunnels.has(sessionId)) {
      const existingTunnel = activeTunnels.get(sessionId)
      return res.json({
        success: true,
        tunnel: existingTunnel,
        message: 'Using existing tunnel',
      })
    }

    // Start cloudflared tunnel
    const cloudflared = spawn('cloudflared', [
      'tunnel',
      '--url',
      `http://localhost:${port}`,
      '--no-autoupdate',
    ])

    let tunnelUrl = null
    let tunnelReady = false

    // Capture tunnel URL from cloudflared output
    cloudflared.stderr.on('data', (data) => {
      const output = data.toString()
      console.log('cloudflared:', output)

      // Extract tunnel URL from output
      const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0]
        tunnelReady = true
        console.log(`Tunnel created for session ${sessionId}: ${tunnelUrl}`)
      }
    })

    cloudflared.on('error', (error) => {
      console.error('cloudflared error:', error)
    })

    cloudflared.on('exit', (code) => {
      console.log(`cloudflared exited with code ${code} for session ${sessionId}`)
      activeTunnels.delete(sessionId)
    })

    // Wait for tunnel to be ready (max 10 seconds)
    const maxWait = 10000
    const startTime = Date.now()
    
    while (!tunnelReady && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    if (!tunnelUrl) {
      cloudflared.kill()
      return res.status(500).json({
        success: false,
        error: 'Failed to create tunnel - timeout',
      })
    }

    const tunnel = {
      sessionId,
      url: tunnelUrl,
      port,
      process: cloudflared,
      createdAt: new Date(),
    }

    activeTunnels.set(sessionId, tunnel)

    // Return tunnel info (without process object)
    res.json({
      success: true,
      tunnel: {
        sessionId: tunnel.sessionId,
        url: tunnel.url,
        port: tunnel.port,
        createdAt: tunnel.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating tunnel:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get tunnel info
app.get('/tunnels/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const tunnel = activeTunnels.get(sessionId)

  if (!tunnel) {
    return res.status(404).json({
      success: false,
      error: 'Tunnel not found',
    })
  }

  res.json({
    success: true,
    tunnel: {
      sessionId: tunnel.sessionId,
      url: tunnel.url,
      port: tunnel.port,
      createdAt: tunnel.createdAt,
    },
  })
})

// Close tunnel
app.delete('/tunnels/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const tunnel = activeTunnels.get(sessionId)

    if (!tunnel) {
      return res.status(404).json({
        success: false,
        error: 'Tunnel not found',
      })
    }

    // Kill the cloudflared process
    tunnel.process.kill()
    activeTunnels.delete(sessionId)

    res.json({
      success: true,
      message: 'Tunnel closed',
    })
  } catch (error) {
    console.error('Error closing tunnel:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// List all active tunnels
app.get('/tunnels', (req, res) => {
  const tunnels = Array.from(activeTunnels.values()).map(t => ({
    sessionId: t.sessionId,
    url: t.url,
    port: t.port,
    createdAt: t.createdAt,
  }))

  res.json({
    success: true,
    tunnels,
    count: tunnels.length,
  })
})

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down tunnel manager...')
  for (const [sessionId, tunnel] of activeTunnels) {
    console.log(`Closing tunnel for session ${sessionId}`)
    tunnel.process.kill()
  }
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`🌐 Tunnel Manager Service running on port ${PORT}`)
})
