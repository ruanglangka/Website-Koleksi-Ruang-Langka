import React, { useState } from 'react'
import mascotImg from '../../assets/mascot/yokcaa.png'

const WAVE_DURATION = 700 

export default function AnimatedLogo({ className = '', alt = 'Logo Ruang Langka', onError }) {
  const [isWaving, setIsWaving] = useState(false)

  function handleClick() {
    setIsWaving(true)
    setTimeout(() => setIsWaving(false), WAVE_DURATION)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${alt}, klik untuk melambai`}
      className={`relative border-0 bg-transparent p-0 ${className}`}
    >
      <img
        src={mascotImg}
        alt={alt}
        onError={onError}
        className={`h-full w-full object-contain motion-safe:animate-mascot-float ${
          isWaving ? 'motion-safe:animate-mascot-wave' : ''
        }`}
      />
      <span className="invisible block h-full w-full" aria-hidden="true" />
    </button>
  )
}