import type { AppState, AppPhase, WeddingPhoto, WeddingProfile, ThemeKey } from '../types'
import { generateProfile } from '../services/classifier'
import { THEMES } from '../data/themes'

export type AppAction =
  | { type: 'INIT_QUEUE'; photos: WeddingPhoto[] }
  | { type: 'ENQUEUE_PHOTOS'; photos: WeddingPhoto[] }
  | { type: 'SWIPE'; direction: 'like' | 'dislike'; photo: WeddingPhoto }
  | { type: 'UNDO' }
  | { type: 'SET_FETCHING'; value: boolean }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CLOSE_MENU' }
  | { type: 'GENERATE_RESULT' }
  | { type: 'SET_PROFILE'; profile: WeddingProfile }
  | { type: 'RESET' }
  | { type: 'ADVANCE_THEME' }

function buildInitialPageByTheme(): Record<ThemeKey, number> {
  return Object.fromEntries(THEMES.map((t) => [t.key, 1])) as Record<ThemeKey, number>
}

export function buildInitialState(): AppState {
  return {
    phase: 'loading' as AppPhase,
    queue: [],
    history: [],
    themeIndex: 0,
    pageByTheme: buildInitialPageByTheme(),
    isFetching: false,
    fetchError: null,
    isHistoryOpen: false,
    isMenuOpen: false,
    profile: null,
  }
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INIT_QUEUE':
      return {
        ...state,
        phase: 'swiping',
        queue: action.photos,
        isFetching: false,
        fetchError: null,
      }

    case 'ENQUEUE_PHOTOS':
      return {
        ...state,
        queue: [...state.queue, ...action.photos],
        isFetching: false,
      }

    case 'SWIPE': {
      const [, ...rest] = state.queue
      return {
        ...state,
        queue: rest,
        history: [
          ...state.history,
          { photo: action.photo, direction: action.direction, timestamp: Date.now() },
        ],
        isMenuOpen: false,
      }
    }

    case 'UNDO': {
      if (state.history.length === 0) return state
      const lastSwipe = state.history[state.history.length - 1]!
      return {
        ...state,
        history: state.history.slice(0, -1),
        queue: [lastSwipe.photo, ...state.queue],
        isMenuOpen: false,
      }
    }

    case 'ADVANCE_THEME': {
      const nextIndex = (state.themeIndex + 1) % THEMES.length
      const themeKey = THEMES[nextIndex]!.key
      return {
        ...state,
        themeIndex: nextIndex,
        pageByTheme: {
          ...state.pageByTheme,
          [themeKey]: state.pageByTheme[themeKey] + 1,
        },
      }
    }

    case 'SET_FETCHING':
      return { ...state, isFetching: action.value }

    case 'SET_ERROR':
      return { ...state, fetchError: action.message, isFetching: false }

    case 'TOGGLE_HISTORY':
      return { ...state, isHistoryOpen: !state.isHistoryOpen, isMenuOpen: false }

    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen }

    case 'CLOSE_MENU':
      return { ...state, isMenuOpen: false }

    case 'GENERATE_RESULT': {
      const profile = generateProfile(state.history)
      return {
        ...state,
        profile,
        phase: 'result',
        isMenuOpen: false,
        isHistoryOpen: false,
      }
    }

    case 'SET_PROFILE':
      return { ...state, profile: action.profile, phase: 'result' }

    case 'RESET':
      return buildInitialState()

    default:
      return state
  }
}
