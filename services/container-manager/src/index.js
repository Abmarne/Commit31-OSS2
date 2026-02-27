import express from 'express'
import Docker from 'dockerode'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const docker = new Docker()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Store active containers
const activeContainers = new Map()

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Container Manager Service is running' })
})

// Create container for a session
app.post('/containers/create', async (req, res) => {
  try {
    const { sessionId, userId, osType, snapshotId } = req.body

    // Determine which image to use
    let imageName
    if (snapshotId) {
      // Use snapshot image
      imageName = snapshotId
    } else {
      // Use OS type image
      imageName = `ghost-labs-workspace:${osType || 'alpine'}`
    }

    // Create container
    const container = await docker.createContainer({
      Image: imageName,
      name: `ghost-lab-${sessionId}-${Date.now()}`,
      Tty: true,
      OpenStdin: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Env: [
        `SESSION_ID=${sessionId}`,
        `USER_ID=${userId}`,
        `OS_TYPE=${osType || 'alpine'}`,
      ],
      HostConfig: {
        Memory: 512 * 1024 * 1024, // 512 MB
        NanoCpus: 1000000000, // 1 CPU
        NetworkMode: 'bridge',
      },
    })

    // Start container
    await container.start()

    const containerInfo = await container.inspect()
    
    activeContainers.set(sessionId, {
      id: container.id,
      sessionId,
      osType: osType || 'alpine',
      snapshotId: snapshotId || null,
      createdAt: new Date(),
    })

    res.json({
      success: true,
      container: {
        id: container.id,
        sessionId,
        status: containerInfo.State.Status,
        osType: osType || 'alpine',
      },
    })
  } catch (error) {
    console.error('Error creating container:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Execute command in container
app.post('/containers/:containerId/exec', async (req, res) => {
  try {
    const { containerId } = req.params
    const { command } = req.body

    const container = docker.getContainer(containerId)
    
    const exec = await container.exec({
      Cmd: ['sh', '-c', command],
      AttachStdout: true,
      AttachStderr: true,
    })

    const stream = await exec.start()
    
    let output = ''
    stream.on('data', (chunk) => {
      output += chunk.toString()
    })

    stream.on('end', () => {
      res.json({
        success: true,
        output,
      })
    })

  } catch (error) {
    console.error('Error executing command:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Create snapshot
app.post('/containers/:containerId/snapshot', async (req, res) => {
  try {
    const { containerId } = req.params
    const { name, tag } = req.body

    const container = docker.getContainer(containerId)
    
    // Commit container to image
    const image = await container.commit({
      repo: name || 'ghost-labs-snapshot',
      tag: tag || 'latest',
    })

    res.json({
      success: true,
      snapshot: {
        imageId: image.Id,
        name,
        tag,
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

// Stop container
app.post('/containers/:containerId/stop', async (req, res) => {
  try {
    const { containerId } = req.params
    const container = docker.getContainer(containerId)
    
    await container.stop()
    await container.remove()

    // Remove from active containers
    for (const [sessionId, info] of activeContainers.entries()) {
      if (info.id === containerId) {
        activeContainers.delete(sessionId)
        break
      }
    }

    res.json({
      success: true,
      message: 'Container stopped and removed',
    })
  } catch (error) {
    console.error('Error stopping container:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// List active containers
app.get('/containers', async (req, res) => {
  try {
    const containers = await docker.listContainers()
    res.json({
      success: true,
      containers: containers.filter(c => c.Names[0].includes('ghost-lab')),
    })
  } catch (error) {
    console.error('Error listing containers:', error)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`🐳 Container Manager Service running on port ${PORT}`)
})
