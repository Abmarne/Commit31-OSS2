import { useState } from 'react'
import './AIAssistant.css'

function AIAssistant() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      // TODO: Send to AI agent backend
    }
  }

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <span>🤖 AI Assistant</span>
      </div>
      <div className="messages">
        {messages.length === 0 ? (
          <div className="placeholder">Ask the AI assistant for help with your code</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Ask AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default AIAssistant
