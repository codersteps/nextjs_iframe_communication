'use client'

import { useRef, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [message, setMessage] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

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
          onSubmit={(e) => {
            e.preventDefault()

            if (!iframeRef.current || !iframeRef.current.contentWindow) {
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
          className={styles.form}
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
