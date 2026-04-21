import { memo, useEffect, useRef, useState } from 'react'
import { Text } from 'react-native'
import { formatCooldown } from '@/constants'

type Props = {
  endsAt: Date
  onExpire?: () => void
  className?: string
}

function calcRemaining(endsAt: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 1000))
}

/**
 * Displays a live countdown to a cooldown end time.
 *
 * Owns its own 1 s `setInterval` so the parent component does not re-render on
 * each tick. When the timer reaches zero the optional `onExpire` callback fires
 * exactly once, allowing the parent to recalculate gating state (e.g. re-enable
 * the Poop button).
 */
export const CooldownTimer = memo(function CooldownTimer({ endsAt, onExpire, className }: Props) {
  const [remaining, setRemaining] = useState(() => calcRemaining(endsAt))
  const firedRef = useRef(false)
  // Keep a stable ref to onExpire so it never needs to be a useEffect dep.
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // Stable numeric timestamp so callers passing a fresh `new Date(...)` each
  // render do not reset/restart this effect.
  const endsAtMs = endsAt.getTime()

  useEffect(() => {
    const endsAtDate = new Date(endsAtMs)
    firedRef.current = false
    const initial = calcRemaining(endsAtDate)
    setRemaining(initial)

    if (initial <= 0) {
      firedRef.current = true
      onExpireRef.current?.()
      return
    }

    const id = setInterval(() => {
      const r = calcRemaining(endsAtDate)
      setRemaining(r)
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true
        clearInterval(id)
        onExpireRef.current?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [endsAtMs])

  return <Text className={className}>{formatCooldown(remaining)}</Text>
})
