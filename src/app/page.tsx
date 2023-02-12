'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [message, setMessage] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePostMessageBackEvent = useCallback(
    (e: MessageEvent<{ message: string; event_type: string }>) => {
      if (e.origin !== 'http://localhost:3000') {
        return
      }
      switch (e.data.event_type) {
        case 'post_message_back':
          alert(JSON.stringify(e.data, null, 2))
          break
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener('message', handlePostMessageBackEvent, false)
    return () => {
      window.removeEventListener('message', handlePostMessageBackEvent)
    }
  }, [handlePostMessageBackEvent])

  return (
    <main className={styles.main}>
      <header>
        <h1 className={styles.title}>Chat application using iframe</h1>
      </header>
      <section>
        <iframe
          ref={iframeRef}
          className={styles.iframe}
          src="/iframe"
          width="460px"
          height="320px"
        />
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault()

            if (
              !message ||
              !iframeRef.current ||
              !iframeRef.current.contentWindow
            ) {
              return
            }

            iframeRef.current.contentWindow.postMessage(
              {
                message,
                event_type: 'post_message',
              },
              '*'
            )

            setMessage('')
          }}
        >
          <input
            type="text"
            placeholder="Send message to iframe"
            value={message}
            onInput={(e) => setMessage(e.currentTarget.value)}
          />
          <button>Post Message</button>
        </form>
      </section>
    </main>
  )
}
