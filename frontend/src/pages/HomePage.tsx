import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'

interface OSOption {
  id: string
  name: string
  description: string
  icon: string
}

interface Snapshot {
  id: string
  name: string
  description: string
  createdAt: string
}

function HomePage() {
  const [sessionId, setSessionId] = useState('')
  const [username, setUsername] = useState('')
  const [selectedOS, setSelectedOS] = useState('alpine')
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null)
  const [osOptions, setOsOptions] = useState<OSOption[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch available OS options
    axios.get('http://localhost:5000/api/sessions/os-options')
      .then(res => {
        if (res.data.success) {
          setOsOptions(res.data.osOptions)
        }
      })
      .catch(err => console.error('Failed to fetch OS options:', err))

    // Fetch available snapshots
    axios.get('http://localhost:5000/api/sessions/snapshots')
      .then(res => {
        if (res.data.success) {
          setSnapshots(res.data.snapshots)
        }
      })
      .catch(err => console.error('Failed to fetch snapshots:', err))
  }, [])

  const createSession = async () => {
    if (!username.trim()) {
      alert('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/sessions/create', {
        osType: selectedSnapshot ? null : selectedOS,
        snapshotId: selectedSnapshot,
        userId: Math.random().toString(36).substring(2, 15),
        username: username.trim(),
      })

      if (response.data.success) {
        const session = response.data.session
        navigate(`/workspace/${session.id}`, { 
          state: { tunnelUrl: session.tunnelUrl } 
        })
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const joinSession = () => {
    if (!sessionId.trim()) {
      alert('Please enter a session ID')
      return
    }
    if (!username.trim()) {
      alert('Please enter your name')
      return
    }
    navigate(`/workspace/${sessionId}`)
  }

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Ghost Labs</h1>
        <p className="tagline">Collaborative Linux Workspaces with AI</p>
      </div>
      
      <div className="actions">
        <div className="username-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
          />
        </div>

        <button 
          className="btn btn-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="advanced-options">
            <div className="os-selection">
              <h3>Choose Operating System</h3>
              <div className="os-grid">
                {osOptions.map((os) => (
                  <div
                    key={os.id}
                    className={`os-card ${selectedOS === os.id && !selectedSnapshot ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedOS(os.id)
                      setSelectedSnapshot(null)
                    }}
                  >
                    <span className="os-icon">{os.icon}</span>
                    <div className="os-name">{os.name}</div>
                    <div className="os-desc">{os.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {snapshots.length > 0 && (
              <div className="snapshot-selection">
                <h3>Or Continue from Snapshot</h3>
                <div className="snapshot-list">
                  {snapshots.map((snapshot) => (
                    <div
                      key={snapshot.id}
                      className={`snapshot-card ${selectedSnapshot === snapshot.id ? 'selected' : ''}`}
                      onClick={() => setSelectedSnapshot(snapshot.id)}
                    >
                      <div className="snapshot-name">💾 {snapshot.name}</div>
                      <div className="snapshot-desc">{snapshot.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={createSession}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Session...' : 'Create New Session'}
        </button>
        
        <div className="join-section">
          <input
            type="text"
            placeholder="Enter Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinSession()}
          />
          <button className="btn btn-secondary" onClick={joinSession}>
            Join Session
          </button>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>🖥️ Persistent Linux Labs</h3>
          <p>Lightweight containers for each user</p>
        </div>
        <div className="feature">
          <h3>🤝 Real-time Collaboration</h3>
          <p>Share and access labs together</p>
        </div>
        <div className="feature">
          <h3>💾 Snapshots</h3>
          <p>Save and resume your work anytime</p>
        </div>
        <div className="feature">
          <h3>🤖 AI Assistant</h3>
          <p>Coding help integrated in workspace</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
