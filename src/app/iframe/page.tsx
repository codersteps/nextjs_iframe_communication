'use client'

import styles from './page.module.css'
import { useCallback, useEffect, useState } from 'react'

export default function Iframe() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handlePostMessageEvent = useCallback(
    (e: MessageEvent<{ message: string; event_type: string }>) => {
      if (e.origin !== 'http://localhost:3000') {
        return
      }
      switch (e.data.event_type) {
        case 'post_message':
          setMessages([...messages, e.data.message])
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
    <div className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()

          if (!message) {
            return
          }

          parent.postMessage(
            {
              message,
              event_type: 'post_message_back',
            },
            '*'
          )

          setMessage('')
          setMessages([...messages, message])
        }}
      >
        <input
          type="text"
          placeholder="Send message to parent"
          value={message}
          onInput={(e) => setMessage(e.currentTarget.value)}
        />
        <button>Post Message Back</button>
      </form>
      <div className={styles.content}>
        {messages.map((message, idx) => (
          <p key={idx}>{message}</p>
        ))}
      </div>
    </div>
  )
}
