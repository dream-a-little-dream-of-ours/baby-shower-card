import { useEffect, useState } from 'react'
import FloralIllustration from './FloralIllustration'
import { supabase } from './supabase'

interface Signature {
  id: string
  name: string
  message: string
  created_at: string
}

export default function App() {
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSignatures()
  }, [])

  async function loadSignatures() {
    const { data, error } = await supabase
      .from('signatures')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading signatures:', error)
    } else {
      setSignatures(data || [])
    }

    setLoading(false)
  }

  async function handleSign() {
    if (!name.trim() || !message.trim()) return

    const { data, error } = await supabase
      .from('signatures')
      .insert({
        name: name.trim(),
        message: message.trim(),
      })
      .select('id, name, message, created_at')
      .single()

    if (error) {
      console.error('Error saving signature:', error)
      alert('Something went wrong saving your message. Please try again.')
      return
    }

    if (data) {
      setSignatures(prev => [...prev, data])
    }

    setSubmitted(true)

    setTimeout(() => {
      setShowModal(false)
      setName('')
      setMessage('')
      setSubmitted(false)
    }, 1400)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#f5f5f3',
        fontFamily: 'var(--font-sans)',
        overflowX: 'hidden',
      }}
    >
      {/* ── Hero card ── */}
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: '64px 24px 0',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 12px' }}>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '100%',
              maxWidth: 460,
            }}
          >
            <FloralIllustration />
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          maxWidth: 560,
          margin: '48px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            height: 1,
            background:
              'linear-gradient(to right, transparent, #3d6b22, transparent)',
          }}
        />
      </div>

      {/* ── Signatures ── */}
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: '40px 24px 0',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#3d6b22',
            margin: '0 0 24px',
            textAlign: 'center',
          }}
        >
          Messages from the team
        </p>

        {loading ? (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: '#4a5e42',
              opacity: 0.6,
            }}
          >
            Loading messages…
          </p>
        ) : signatures.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: '#4a5e42',
              opacity: 0.6,
              margin: '0 0 8px',
            }}
          >
            Be the first to sign the card 🌿
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {signatures.map((sig, i) => (
              <SignatureCard key={sig.id} sig={sig} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Sign CTA ── */}
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: '40px 24px 0',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#fff',
            background: '#3d6b22',
            border: 'none',
            borderRadius: 100,
            padding: '14px 36px',
            cursor: 'pointer',
            transition: 'opacity 0.15s, transform 0.15s',
            boxShadow: '0 4px 20px rgba(61,107,34,0.30)',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
            ;(e.currentTarget as HTMLButtonElement).style.transform =
              'translateY(-1px)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            ;(e.currentTarget as HTMLButtonElement).style.transform =
              'translateY(0)'
          }}
        >
          Sign the card 🌿
        </button>
      </div>

      {/* ── Signer count ── */}
      <div style={{ textAlign: 'center', padding: '20px 24px 0' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            fontWeight: 400,
            color: '#4a5e42',
            margin: 0,
          }}
        >
          {signatures.length}{' '}
          {signatures.length === 1 ? 'person has' : 'people have'} signed this
          card.
        </p>
      </div>

      {/* ── Footer divider ── */}
      <div
        style={{
          maxWidth: 560,
          margin: '48px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            height: 1,
            background:
              'linear-gradient(to right, transparent, #3d6b22, transparent)',
          }}
        />
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '48px 24px 40px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 300,
            color: '#4a5e42',
            margin: 0,
            letterSpacing: '0.03em',
          }}
        >
          Designed with ♥ by Your Team
        </p>
      </footer>

      {/* ── Sign modal ── */}
      {showModal && (
        <div
          onClick={e => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45,31,26,0.35)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100,
            padding: '0 0 env(safe-area-inset-bottom)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              background: '#fff',
              borderRadius: '20px 20px 0 0',
              padding: '32px 28px 40px',
              boxShadow: '0 -8px 40px rgba(45,31,26,0.12)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🌿</div>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 22,
                    color: 'var(--color-ink)',
                    margin: '0 0 8px',
                  }}
                >
                  Message added!
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--color-ink)',
                    opacity: 0.5,
                    margin: 0,
                  }}
                >
                  Thank you for signing the card.
                </p>
              </div>
            ) : (
              <>
                {/* Drag handle */}
                <div
                  style={{
                    width: 36,
                    height: 4,
                    background: 'var(--color-mist)',
                    borderRadius: 2,
                    margin: '-12px auto 28px',
                  }}
                />

                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 26,
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    margin: '0 0 6px',
                  }}
                >
                  Sign the card
                </h2>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--color-ink)',
                    opacity: 0.45,
                    margin: '0 0 28px',
                  }}
                >
                  Your message will appear on the card.
                </p>

                <label style={labelStyle}>Your name</label>

                <input
                  type="text"
                  placeholder="e.g. Alex M."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  autoFocus
                />

                <label style={{ ...labelStyle, marginTop: 16 }}>
                  Message
                </label>

                <textarea
                  placeholder="Write something heartfelt…"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'none',
                    lineHeight: 1.6,
                  }}
                />

                <button
                  onClick={handleSign}
                  disabled={!name.trim() || !message.trim()}
                  style={{
                    marginTop: 24,
                    width: '100%',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#fff',
                    background:
                      !name.trim() || !message.trim()
                        ? '#a8c994'
                        : '#3d6b22',
                    border: 'none',
                    borderRadius: 100,
                    padding: '15px',
                    cursor:
                      !name.trim() || !message.trim()
                        ? 'not-allowed'
                        : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  Sign the card 🌿
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SignatureCard({
  sig,
  index,
}: {
  sig: Signature
  index: number
}) {
  const rotations = [-1.2, 0.8, -0.5, 1.5, -0.9, 0.4]
  const rotate = rotations[index % rotations.length]

  return (
    <div
      style={{
        background:
          index % 3 === 0
            ? '#fef7d0'
            : index % 3 === 1
              ? '#fbe8e3'
              : '#fff',
        borderRadius: 14,
        padding: '20px 20px 22px',
        boxShadow: '0 2px 16px rgba(45,31,26,0.06)',
        transform: `rotate(${rotate}deg)`,
        transition: 'transform 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLDivElement).style.transform =
          'rotate(0deg) scale(1.02)')
      }
      onMouseLeave={e =>
        ((e.currentTarget as HTMLDivElement).style.transform =
          `rotate(${rotate}deg)`)
      }
    >
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          lineHeight: 1.65,
          color: 'var(--color-ink)',
          margin: '0 0 14px',
          opacity: 0.8,
        }}
      >
        {sig.message}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 15,
          color: '#8c2d1d',
          margin: 0,
        }}
      >
        — {sig.name}
      </p>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--color-ink)',
  opacity: 0.5,
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-sans)',
  fontSize: 15,
  color: 'var(--color-ink)',
  background: 'var(--color-cream)',
  border: '1.5px solid var(--color-mist)',
  borderRadius: 12,
  padding: '12px 16px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
