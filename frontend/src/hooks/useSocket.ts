import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(sessionId: string): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // TODO: Replace with actual backend URL
    const newSocket = io('http://localhost:5000', {
      query: { sessionId },
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [sessionId])

  return socket
}
