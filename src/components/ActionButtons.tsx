import { motion } from 'framer-motion'
import type { SwipeDirection } from '../types'

interface Props {
  onSwipe: (direction: SwipeDirection) => void
  disabled?: boolean
}

export default function ActionButtons({ onSwipe, disabled }: Props) {
  return (
    <div className="flex items-center justify-center gap-8 pb-2 pt-4">
      {/* Dislike */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        disabled={disabled}
        onClick={() => onSwipe('dislike')}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-40"
        aria-label="Não curtir"
      >
        <span className="text-2xl">✕</span>
      </motion.button>

      {/* Undo (small center button) */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        disabled={disabled}
        onClick={() => {
          /* handled by menu undo */
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow disabled:opacity-30"
        aria-label="Desfazer"
        style={{ display: 'none' }}
      >
        <span className="text-base">↩</span>
      </motion.button>

      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.08 }}
        disabled={disabled}
        onClick={() => onSwipe('like')}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-900/50 disabled:opacity-40"
        aria-label="Curtir"
      >
        <span className="text-2xl">♥</span>
      </motion.button>
    </div>
  )
}
