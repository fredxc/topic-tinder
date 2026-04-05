import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/context'
import type { SwipeRecord } from '../types'

export default function HistoryModal() {
  const { state, dispatch } = useAppStore()
  const [tab, setTab] = useState<'like' | 'dislike'>('like')

  const liked = state.history.filter((s) => s.direction === 'like')
  const disliked = state.history.filter((s) => s.direction === 'dislike')
  const current = tab === 'like' ? liked : disliked

  return (
    <AnimatePresence>
      {state.isHistoryOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <h2 className="font-playfair text-xl font-semibold text-gray-900">
                Suas avaliações
              </h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-5">
              {(['like', 'dislike'] as const).map((t) => {
                const isActive = tab === t
                const count = t === 'like' ? liked.length : disliked.length
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative pb-3 pr-6 text-sm font-medium transition-colors ${
                      isActive ? 'text-rose-600' : 'text-gray-400'
                    }`}
                  >
                    {t === 'like' ? '♥ Amei' : '✕ Passei'}
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                        isActive ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-6 h-0.5 rounded-full bg-rose-500"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {current.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-300">
                  <span className="text-4xl">{tab === 'like' ? '♥' : '✕'}</span>
                  <p className="text-sm">Nenhuma foto aqui ainda</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {current.map((record: SwipeRecord) => (
                    <motion.div
                      key={record.photo.id + record.timestamp}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-[3/4] overflow-hidden rounded-xl"
                      style={{ backgroundColor: record.photo.dominantColor }}
                    >
                      <img
                        src={record.photo.thumbUrl}
                        alt={record.photo.altDescription}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                          record.direction === 'like' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      >
                        {record.direction === 'like' ? '♥' : '✕'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
