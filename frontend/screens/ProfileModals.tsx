import type { ReactNode } from 'react'
import { Fragment } from 'react'

interface ProfileModalsProps {
  /** The sign-out confirmation dialog JSX from useSignOutDialog(). */
  signOutDialog: ReactNode
}

/**
 * Collects all modal overlays for ProfileScreen into one place.
 * Co-located with ProfileScreen so future modals (wallet, settings, etc.)
 * can be added here without cluttering the main screen component.
 */
export default function ProfileModals({ signOutDialog }: ProfileModalsProps) {
  return <Fragment>{signOutDialog}</Fragment>
}
