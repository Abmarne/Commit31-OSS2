import { useEffect, useRef } from 'react'
import './VideoCall.css'

interface VideoCallProps {
  sessionId: string
}

function VideoCall({ sessionId }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // TODO: Initialize WebRTC here
    console.log('VideoCall component mounted for session:', sessionId)
  }, [sessionId])

  return (
    <div className="video-call">
      <div className="video-header">
        <span>Participants</span>
      </div>
      <div className="video-grid">
        <div className="video-item">
          <video ref={localVideoRef} autoPlay muted className="video-element" />
          <span className="video-label">You</span>
        </div>
        {/* Remote participants will be added here */}
      </div>
    </div>
  )
}

export default VideoCall
