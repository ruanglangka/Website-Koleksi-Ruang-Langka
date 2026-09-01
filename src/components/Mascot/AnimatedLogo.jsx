import React from 'react'

function resolveSrc(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export default function AnimatedLogo({ className = '', alt = 'Logo Ruang Langka', onError }) {
  return (
    <img
      src={resolveSrc('mascot/yokcaa.png')}
      alt={alt}
      onError={onError}
      className={`wave-loop object-contain ${className}`}
    />
  )
}
