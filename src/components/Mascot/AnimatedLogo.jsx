import React from 'react'
import mascotLogo from '../../assets/mascot/yokcaa.png'

export default function StaticLogo({ className = '', alt = 'Logo Ruang Langka', onError }) {
  return (
    <div className={`relative border-0 bg-transparent p-0 ${className}`}>
      <img
        src={mascotLogo}
        alt={alt}
        onError={onError}
        className="h-full w-full object-contain"
      />
    </div>
  )
}