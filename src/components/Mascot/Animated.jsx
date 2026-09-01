import React, { useEffect, useRef, useState } from 'react'

// 1. Import gambar langsung dari folder src/assets
import mascotIdle from '../../assets/mascot/yokcaa.png'
import mascotBlink from '../../assets/mascot/yokcaa.png' // Ganti jika ada gambar khusus blink
import mascotWave from '../../assets/mascot/yokcaa.png'  // Ganti jika ada gambar khusus wave

// 2. Masukkan variabel gambar yang di-import ke dalam objek FRAMES
const FRAMES = {
  idle: mascotIdle,
  blink: mascotBlink,
  wave: mascotWave,
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

// Rentang waktu (ms) antar kedipan/lambaian — dibuat acak biar tidak terasa robotik.
const BLINK_MIN = 2500
const BLINK_MAX = 5000
const BLINK_DURATION = 500
const WAVE_MIN = 9000
const WAVE_MAX = 16000
const WAVE_DURATION = 1200

export default function AnimatedLogo({ className = '', alt = 'Logo Ruang Langka', onError }) {
  const [frame, setFrame] = useState('idle')
  const frameRef = useRef('idle') // salinan sinkron untuk dicek di dalam timer

  useEffect(() => {
    frameRef.current = frame
  }, [frame])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined // tetap diam di idle, tidak dijadwalkan

    let cancelled = false
    let blinkTimer
    let waveTimer

    function playBlink() {
      // Jangan menyela saat sedang wave
      if (frameRef.current !== 'wave') {
        setFrame('blink')
        setTimeout(() => {
          if (!cancelled && frameRef.current !== 'wave') setFrame('idle')
        }, BLINK_DURATION)
      }
      blinkTimer = setTimeout(playBlink, rand(BLINK_MIN, BLINK_MAX))
    }

    function playWave() {
      setFrame('wave')
      setTimeout(() => {
        if (!cancelled) setFrame('idle')
      }, WAVE_DURATION)
      waveTimer = setTimeout(playWave, rand(WAVE_MIN, WAVE_MAX))
    }

    blinkTimer = setTimeout(playBlink, rand(BLINK_MIN, BLINK_MAX))
    waveTimer = setTimeout(playWave, rand(WAVE_MIN, WAVE_MAX))

    return () => {
      cancelled = true
      clearTimeout(blinkTimer)
      clearTimeout(waveTimer)
    }
  }, [])

  function handleClick() {
    setFrame('wave')
    setTimeout(() => setFrame('idle'), WAVE_DURATION)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${alt}, klik untuk melambai`}
      className={`relative border-0 bg-transparent p-0 ${className}`}
    >
      {Object.entries(FRAMES).map(([key, src]) => (
        <img
          key={key}
          // 3. Panggil langsung src-nya tanpa resolveSrc
          src={src}
          alt={key === 'idle' ? alt : ''}
          aria-hidden={key !== 'idle'}
          onError={key === 'idle' ? onError : undefined}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-150 ${
            frame === key ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
        <span className="invisible block h-full w-full" aria-hidden="true" />
    </button>
  )
}