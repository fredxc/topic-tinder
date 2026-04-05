import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Heart {
  id: number
  left: string
  size: number
  delay: number
  duration: number
  opacity: number
}

export default function FloatingHearts() {
  const hearts: Heart[] = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: 10 + Math.random() * 22,
        delay: Math.random() * 15,
        duration: 18 + Math.random() * 14,
        opacity: 0.08 + Math.random() * 0.15,
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute select-none"
          style={{
            left: h.left,
            bottom: '-10%',
            fontSize: h.size,
            opacity: h.opacity,
          }}
          animate={{
            y: [0, -(window.innerHeight * 1.3)],
            x: [0, Math.random() > 0.5 ? 30 : -30, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  )
}
