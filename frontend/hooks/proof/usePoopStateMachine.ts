import { getThresholdForDifficulty } from '@pop/shared'
import type { RefObject } from 'react'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import type {
  ChallengeStatus,
  DetectionResult,
  NFT,
  RateLimitError,
  UseImmobilityChallengeReturn,
  UseToiletDetectionReturn,
} from '@/types'

/** Per-NFT-type immobility duration in milliseconds. */
export const IMMOBILITY_MS_BY_TYPE: Record<NFT['type'], number> = {
  'turbo-flush': 5_000,
  'cruise-seat': 10_000,
  'zen-fortress': 15_000,
}

/** Detection confidence threshold passed to YAMNet for the standard game difficulty. */
export const GAME_THRESHOLD = getThresholdForDifficulty('normal') // 0.7

/** Discriminated union of the seven phases of the Poop game flow. */
export type PoopPhase =
  | 'idle'
  | 'countdown'
  | 'immobility'
  | 'prompt'
  | 'recording'
  | 'results'
  | 'roulette'

interface PoopState {
  phase: PoopPhase
  /** NFT that started the active challenge — snapshot, immutable for the duration of the run. */
  activeNFT: NFT | null
  /** 3-2-1 countdown value displayed during `countdown` phase. */
  countdownValue: number
  /** Total immobility window in ms for the active NFT (set on `START`). */
  gameImmobilityMs: number
  /** Frozen remaining time displayed while immobility status is `warning`. `null` while running. */
  frozenRemainingTime: number | null
  /** Toast text shown on the idle screen after a failed immobility attempt. */
  immobilityMessage: string | null
}

type PoopAction =
  | { type: 'START'; nft: NFT }
  | { type: 'COUNTDOWN_TICK' }
  | { type: 'COUNTDOWN_DONE' }
  | { type: 'IMMOBILITY_FREEZE'; remaining: number }
  | { type: 'IMMOBILITY_UNFREEZE' }
  | { type: 'IMMOBILITY_COMPLETE' }
  | { type: 'IMMOBILITY_FAILED' }
  | { type: 'BEGIN_RECORDING' }
  | { type: 'RECORDING_RESOLVED' }
  | { type: 'GO_TO_ROULETTE' }
  | { type: 'CANCEL' }
  | { type: 'RESET' }
  | { type: 'CLEAR_TOAST' }

const initialState: PoopState = {
  phase: 'idle',
  activeNFT: null,
  countdownValue: 3,
  gameImmobilityMs: 10_000,
  frozenRemainingTime: null,
  immobilityMessage: null,
}

/**
 * Pure reducer for the Poop screen's 7-phase state machine. All phase
 * transitions are explicit — there are no implicit transitions hidden inside
 * `useEffect` dependency arrays.
 */
export function poopStateReducer(state: PoopState, action: PoopAction): PoopState {
  switch (action.type) {
    case 'START':
      if (state.phase !== 'idle') return state
      return {
        ...state,
        phase: 'countdown',
        activeNFT: action.nft,
        countdownValue: 3,
        gameImmobilityMs: IMMOBILITY_MS_BY_TYPE[action.nft.type] ?? 10_000,
        frozenRemainingTime: null,
        immobilityMessage: null,
      }

    case 'COUNTDOWN_TICK':
      if (state.phase !== 'countdown') return state
      return { ...state, countdownValue: Math.max(1, state.countdownValue - 1) }

    case 'COUNTDOWN_DONE':
      if (state.phase !== 'countdown') return state
      return { ...state, phase: 'immobility', frozenRemainingTime: null }

    case 'IMMOBILITY_FREEZE':
      if (state.phase !== 'immobility' || state.frozenRemainingTime !== null) return state
      return { ...state, frozenRemainingTime: action.remaining }

    case 'IMMOBILITY_UNFREEZE':
      if (state.phase !== 'immobility' || state.frozenRemainingTime === null) return state
      return { ...state, frozenRemainingTime: null }

    case 'IMMOBILITY_COMPLETE':
      if (state.phase !== 'immobility') return state
      return { ...state, phase: 'prompt' }

    case 'IMMOBILITY_FAILED':
      if (state.phase !== 'immobility') return state
      return {
        ...initialState,
        immobilityMessage: 'Too much movement — try again!',
      }

    case 'BEGIN_RECORDING':
      if (state.phase !== 'prompt') return state
      return { ...state, phase: 'recording' }

    case 'RECORDING_RESOLVED':
      if (state.phase !== 'recording') return state
      return { ...state, phase: 'results' }

    case 'GO_TO_ROULETTE':
      if (state.phase !== 'results') return state
      return { ...state, phase: 'roulette' }

    case 'CANCEL':
      return { ...initialState, immobilityMessage: state.immobilityMessage }

    case 'RESET':
      return initialState

    case 'CLEAR_TOAST':
      if (state.immobilityMessage === null) return state
      return { ...state, immobilityMessage: null }

    default:
      return state
  }
}

interface UsePoopStateMachineDeps {
  immobility: UseImmobilityChallengeReturn
  recording: UseToiletDetectionReturn
}

export interface UsePoopStateMachineReturn {
  phase: PoopPhase
  activeNFT: NFT | null
  countdownValue: number
  /** Effective remaining time = frozen value (when warning) or live `gameImmobilityMs - elapsedTime`. */
  remainingTime: number
  immobilityStatus: ChallengeStatus
  immobilityMessage: string | null
  /** Detection signals exposed for the screen-level XP-grant effect. */
  detectionResult: DetectionResult | null
  detectionError: string | null
  rateLimitError: RateLimitError | null
  /** Single-fire guard for the screen's `poopNFT` mutation; cleared on `reset()`. */
  hasPoopedRef: RefObject<boolean>
  // Actions
  start: (nft: NFT) => void
  cancelCountdownOrImmobility: () => void
  cancelPrompt: () => void
  cancelRecording: () => void
  beginRecording: () => void
  goToRoulette: () => void
  reset: () => void
}

/**
 * Manages the Poop screen's 7-phase game flow. Phase transitions are explicit
 * reducer dispatches — `useEffect` is used only to bridge external timing /
 * sensor / detection signals into the reducer, never to implicitly transition.
 *
 * The hook does not own `useImmobilityChallenge` or `useToiletDetection`; the
 * screen instantiates them and passes them in via `deps`. This keeps the state
 * machine pure and avoids duplicate hook instances.
 */
export function usePoopStateMachine(deps: UsePoopStateMachineDeps): UsePoopStateMachineReturn {
  const { immobility, recording } = deps
  const [state, dispatch] = useReducer(poopStateReducer, initialState)

  const hasPoopedRef = useRef(false)

  const {
    elapsedTime,
    status: immobilityStatus,
    isRunning: immobilityRunning,
    startChallenge,
    stopChallenge,
  } = immobility

  const {
    audioUri,
    detectionResult,
    isAnalyzing,
    error: detectionError,
    rateLimitError,
    startRecording,
    analyzeAudio,
    clearResult,
  } = recording

  // ── Bridge 1: 3-2-1 countdown ──────────────────────────────
  // Single 1 s interval mirrors the original implementation: ticks 3 → 2 → 1,
  // then on the next boundary starts the challenge and transitions.
  const countdownValueRef = useRef(state.countdownValue)
  countdownValueRef.current = state.countdownValue
  useEffect(() => {
    if (state.phase !== 'countdown') return
    const id = setInterval(() => {
      if (countdownValueRef.current <= 1) {
        startChallenge()
        dispatch({ type: 'COUNTDOWN_DONE' })
      } else {
        dispatch({ type: 'COUNTDOWN_TICK' })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [state.phase, startChallenge])

  // ── Bridge 2: immobility sensor signals ───────────────────
  useEffect(() => {
    if (state.phase !== 'immobility') return

    if (immobilityStatus === 'warning' && state.frozenRemainingTime === null) {
      dispatch({
        type: 'IMMOBILITY_FREEZE',
        remaining: Math.max(0, state.gameImmobilityMs - elapsedTime),
      })
      return
    }
    if (immobilityStatus === 'running' && state.frozenRemainingTime !== null) {
      dispatch({ type: 'IMMOBILITY_UNFREEZE' })
      return
    }
    if (elapsedTime >= state.gameImmobilityMs && immobilityStatus === 'running') {
      stopChallenge()
      dispatch({ type: 'IMMOBILITY_COMPLETE' })
      return
    }
    // Hook reset (grace period expired): isRunning=false, status='idle', elapsedTime=0
    if (!immobilityRunning && immobilityStatus === 'idle' && elapsedTime === 0) {
      dispatch({ type: 'IMMOBILITY_FAILED' })
    }
  }, [
    state.phase,
    state.frozenRemainingTime,
    state.gameImmobilityMs,
    elapsedTime,
    immobilityStatus,
    immobilityRunning,
    stopChallenge,
  ])

  // ── Bridge 3: recording → analyze → results ───────────────
  // Auto-analyze once audioUri is available. Guard on !detectionError so a
  // failed attempt does not re-trigger analyzeAudio (which would clear the
  // error before the phase transition to 'results').
  useEffect(() => {
    if (
      state.phase === 'recording' &&
      audioUri &&
      !isAnalyzing &&
      !detectionResult &&
      !detectionError
    ) {
      analyzeAudio(GAME_THRESHOLD)
    }
  }, [state.phase, audioUri, isAnalyzing, detectionResult, detectionError, analyzeAudio])

  useEffect(() => {
    if (
      state.phase === 'recording' &&
      (detectionResult || rateLimitError || (detectionError && !isAnalyzing))
    ) {
      dispatch({ type: 'RECORDING_RESOLVED' })
    }
  }, [state.phase, detectionResult, rateLimitError, detectionError, isAnalyzing])

  // ── Bridge 4: auto-clear immobility toast after 3 s ───────
  useEffect(() => {
    if (!state.immobilityMessage) return
    const id = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000)
    return () => clearTimeout(id)
  }, [state.immobilityMessage])

  // ── Actions ────────────────────────────────────────────────
  const start = useCallback((nft: NFT) => {
    hasPoopedRef.current = false
    dispatch({ type: 'START', nft })
  }, [])

  const cancelCountdownOrImmobility = useCallback(() => {
    stopChallenge()
    dispatch({ type: 'CANCEL' })
  }, [stopChallenge])

  const cancelPrompt = useCallback(() => {
    dispatch({ type: 'CANCEL' })
  }, [])

  const cancelRecording = useCallback(() => {
    clearResult()
    dispatch({ type: 'CANCEL' })
  }, [clearResult])

  const beginRecording = useCallback(() => {
    dispatch({ type: 'BEGIN_RECORDING' })
    startRecording()
  }, [startRecording])

  const goToRoulette = useCallback(() => {
    dispatch({ type: 'GO_TO_ROULETTE' })
  }, [])

  const reset = useCallback(() => {
    clearResult()
    hasPoopedRef.current = false
    dispatch({ type: 'RESET' })
  }, [clearResult])

  // ── Derived ────────────────────────────────────────────────
  const remainingTime =
    state.frozenRemainingTime !== null
      ? state.frozenRemainingTime
      : Math.max(0, state.gameImmobilityMs - elapsedTime)

  return {
    phase: state.phase,
    activeNFT: state.activeNFT,
    countdownValue: state.countdownValue,
    remainingTime,
    immobilityStatus,
    immobilityMessage: state.immobilityMessage,
    detectionResult,
    detectionError,
    rateLimitError,
    hasPoopedRef,
    start,
    cancelCountdownOrImmobility,
    cancelPrompt,
    cancelRecording,
    beginRecording,
    goToRoulette,
    reset,
  }
}
