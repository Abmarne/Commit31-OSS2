import { useEffect, useRef } from 'react'
import './Terminal.css'

function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // TODO: Initialize xterm.js here
    // This is a placeholder for the actual terminal implementation
    console.log('Terminal component mounted')
  }, [])

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span>Terminal</span>
      </div>
      <div ref={terminalRef} className="terminal" id="terminal">
        {/* xterm.js will be attached here */}
        <div className="placeholder">Terminal will be initialized here using xterm.js</div>
      </div>
    </div>
  )
}

export default Terminal
