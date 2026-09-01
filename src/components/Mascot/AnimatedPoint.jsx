import React from 'react'
import mascotImage from '../../assets/mascot/yokcaa.png'

export default function AnimatedPoint({ className = '', alt = 'Logo Ruang Langka', onError }) {
  return (
    <img
      src={mascotImage}
      alt={alt}
      onError={onError}
      className={`point-loop object-contain ${className}`}
    />
  )
}