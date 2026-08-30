import React from 'react'

function resolveSrc(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export default function AnimatedPoint({ className = '', alt = 'Logo Ruang Langka', onError }) {
  return (
    <img
      src={resolveSrc('mascot/point.png')}
      alt={alt}
      onError={onError}
      className={`point-loop object-contain ${className}`}
    />
  )
}