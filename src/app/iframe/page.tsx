'use client'

import styles from './page.module.css'
import { useCallback, useEffect, useState } from 'react'

export default function Iframe() {
  const [messages, setMessages] = useState<string[]>([])

  const handlePostMessageEvent = useCallback(
    (e: MessageEvent<{ message: string; event_type: string }>) => {
      if (e.origin !== 'http://localhost:3000') {
        return
      }
      const { event_type, message } = e.data
      switch (event_type) {
        case 'post_message':
          setMessages([...messages, message])
          break
      }
    },
    [messages]
  )

  useEffect(() => {
    window.addEventListener('message', handlePostMessageEvent, false)
    return () => {
      window.removeEventListener('message', handlePostMessageEvent)
    }
  }, [handlePostMessageEvent])

  return (
    <div className={styles['iframe-content']}>
      {messages.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </div>
  )
}
