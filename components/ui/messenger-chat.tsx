'use client'

/**
 * MessengerChat
 * ──────────────────────────────────────────────────────────────────────
 * Floating Messenger button — opens m.me link in a new tab.
 * No SDK dependency, works on all browsers and devices.
 */
export function MessengerChat() {
  return (
    <a
      href="https://m.me/Bstarquartzarea"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Messenger"
      style={{
        position:        'fixed',
        bottom:          '24px',
        right:           '24px',
        zIndex:          9999,
        width:           '56px',
        height:          '56px',
        borderRadius:    '50%',
        background:      'linear-gradient(135deg, #D92D20 0%, #ff6b35 100%)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        boxShadow:       '0 4px 16px rgba(217,45,32,0.5)',
        cursor:          'pointer',
        textDecoration:  'none',
        transition:      'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform  = 'scale(1.1)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 20px rgba(217,45,32,0.7)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform  = 'scale(1)'
        ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(217,45,32,0.5)'
      }}
    >
      {/* Messenger icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 2C7.373 2 2 7.09 2 13.333c0 3.311 1.42 6.278 3.7 8.4V26l4.2-2.31A12.7 12.7 0 0014 24c6.627 0 12-5.09 12-10.667S20.627 2 14 2z"
          fill="white"
        />
        <path
          d="M15.273 17.067l-3.054-3.254-5.965 3.254 6.563-6.967 3.127 3.254 5.892-3.254-6.563 6.967z"
          fill="#D92D20"
        />
      </svg>
    </a>
  )
}
