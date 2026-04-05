import { useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/context'
import { THEMES } from './data/themes'
import { fetchThemePhotos, shuffle } from './services/unsplash'
import LoadingScreen from './components/LoadingScreen'
import FloatingHearts from './components/FloatingHearts'
import CardStack from './components/CardStack'
import ActionButtons from './components/ActionButtons'
import ProgressBar from './components/ProgressBar'
import MenuDots from './components/MenuDots'
import HistoryModal from './components/HistoryModal'
import ResultScreen from './components/ResultScreen'
import type { SwipeDirection, WeddingPhoto } from './types'

const PREFETCH_THRESHOLD = 5   // fetch more when queue drops below this
const INITIAL_THEMES = 4       // number of themes to fetch on startup

export default function App() {
  const { state, dispatch } = useAppStore()
  const isFetchingRef = useRef(false)

  // ── Prefetch logic ───────────────────────────────────────────────
  const fetchNextTheme = useCallback(async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    dispatch({ type: 'SET_FETCHING', value: true })

    const theme = THEMES[state.themeIndex % THEMES.length]!
    const page = state.pageByTheme[theme.key]

    try {
      const photos = await fetchThemePhotos(theme.key, theme.query, page)
      dispatch({ type: 'ENQUEUE_PHOTOS', photos })
      dispatch({ type: 'ADVANCE_THEME' })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: String(err) })
    } finally {
      isFetchingRef.current = false
    }
  }, [state.themeIndex, state.pageByTheme, dispatch])

  // ── Initial load ─────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      isFetchingRef.current = true
      const themesToFetch = THEMES.slice(0, INITIAL_THEMES)

      try {
        const batches = await Promise.allSettled(
          themesToFetch.map((t) => fetchThemePhotos(t.key, t.query, 1))
        )

        const photos: WeddingPhoto[] = []
        for (const result of batches) {
          if (result.status === 'fulfilled') photos.push(...result.value)
        }

        dispatch({ type: 'INIT_QUEUE', photos: shuffle(photos) })
      } catch (err) {
        dispatch({ type: 'SET_ERROR', message: String(err) })
      } finally {
        isFetchingRef.current = false
      }
    }

    void init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-prefetch when queue runs low ────────────────────────────
  useEffect(() => {
    if (
      state.phase === 'swiping' &&
      state.queue.length < PREFETCH_THRESHOLD &&
      !state.isFetching &&
      !isFetchingRef.current
    ) {
      void fetchNextTheme()
    }
  }, [state.queue.length, state.phase, state.isFetching, fetchNextTheme])

  // ── Swipe handler ─────────────────────────────────────────────────
  const handleSwipe = useCallback(
    (direction: SwipeDirection, photo: WeddingPhoto) => {
      dispatch({ type: 'SWIPE', direction, photo })
    },
    [dispatch]
  )

  // ── Top-card swipe from buttons ───────────────────────────────────
  const handleButtonSwipe = useCallback(
    (direction: SwipeDirection) => {
      const photo = state.queue[0]
      if (!photo) return
      dispatch({ type: 'SWIPE', direction, photo })
    },
    [state.queue, dispatch]
  )

  // ── Keyboard shortcuts (desktop) ──────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state.phase !== 'swiping' || state.isMenuOpen || state.isHistoryOpen) return
      if (e.key === 'ArrowRight') handleButtonSwipe('like')
      if (e.key === 'ArrowLeft')  handleButtonSwipe('dislike')
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) dispatch({ type: 'UNDO' })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.phase, state.isMenuOpen, state.isHistoryOpen, handleButtonSwipe, dispatch])

  // ── Render ─────────────────────────────────────────────────────────
  if (state.phase === 'loading') return <LoadingScreen />
  if (state.phase === 'result')  return <ResultScreen />

  const noPhotosLeft = state.queue.length === 0

  return (
    <div className="flex h-dvh items-center justify-center overflow-hidden bg-gradient-to-b from-rose-950 via-rose-900 to-rose-800">
      <FloatingHearts />

      {/* Phone-shaped container — max 430px wide for desktop */}
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden">

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-5 pb-2 pt-4">
        <div className="w-10" /> {/* spacer */}
        <div className="text-center">
          <h1 className="font-playfair text-xl font-bold italic text-white text-shadow">
            Wedding Tinder
          </h1>
        </div>
        <MenuDots />
      </header>

      {/* Progress */}
      <div className="relative z-20">
        <ProgressBar swipeCount={state.history.length} />
      </div>

      {/* Card area */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden px-4 py-3">
        <AnimatePresence mode="wait">
          {noPhotosLeft ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
            >
              {state.isFetching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="text-4xl"
                  >
                    💫
                  </motion.div>
                  <p className="font-playfair italic text-rose-200">
                    Buscando mais inspirações...
                  </p>
                </>
              ) : (
                <>
                  <span className="text-5xl">🌸</span>
                  <p className="font-playfair text-lg italic text-rose-200">
                    Você viu todas as fotos!
                  </p>
                  <button
                    onClick={() => dispatch({ type: 'GENERATE_RESULT' })}
                    className="mt-2 rounded-full bg-white px-6 py-3 font-semibold text-rose-700 shadow-lg"
                  >
                    Ver meu perfil
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="stack"
              className="relative flex-1 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CardStack photos={state.queue} onSwipe={handleSwipe} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Action buttons */}
      {!noPhotosLeft && (
        <div className="relative z-20 pb-safe pb-4">
          <ActionButtons onSwipe={handleButtonSwipe} disabled={noPhotosLeft} />
        </div>
      )}

      {/* Hint (first time) */}
      {state.history.length === 0 && !noPhotosLeft && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-28 left-0 right-0 z-20 flex items-center justify-center gap-6 text-sm text-white/50"
        >
          <span>← Não</span>
          <span className="text-xs">deslize para avaliar</span>
          <span>Sim →</span>
        </motion.div>
      )}

      {/* History modal */}
      <HistoryModal />

      </div> {/* end phone container */}
    </div>
  )
}
