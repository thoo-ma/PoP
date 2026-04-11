import { MaterialIcons } from '@expo/vector-icons'
import { Avatar, Button, cn, Dialog, Spinner } from 'heroui-native'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { useCSSVariable } from 'uniwind'
import { useAuth, useProfileStats, useUserNFTs } from '@/hooks'
import { dialogPanel, profileModal, tactileButton, tactileButtonText } from '@/styles'
import { useSignOutDialog } from '@/utils'

interface ProfileProps {
  /** Controls the visibility of the profile modal. */
  visible: boolean
  /** Called when the user dismisses the profile modal. */
  onClose: () => void
}

/**
 * Profile modal screen showing the current user's display name, email,
 * and placeholder stats (Detections, NFTs, Days Active).
 * Provides a sign-out action with a confirmation prompt.
 */
export default function Profile({ visible, onClose }: ProfileProps) {
  const { getUserDisplayName, user, signOut } = useAuth()
  const { detections, daysActive, loading: statsLoading } = useProfileStats()
  const { nfts } = useUserNFTs()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { dialog: signOutDialog, show: showSignOutDialog } = useSignOutDialog()
  const onSurface = useCSSVariable('--color-on-surface') as string

  const handleSignOut = () => {
    showSignOutDialog(async () => {
      setIsSigningOut(true)
      try {
        await signOut()
        onClose()
      } finally {
        setIsSigningOut(false)
      }
    })
  }

  const initials = getUserDisplayName()
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const panel = dialogPanel()
  const p = profileModal()

  return (
    <>
      <Dialog
        isOpen={visible}
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay isCloseOnPress />
          <Dialog.Content className={panel.content()}>
            <Dialog.Close
              variant="ghost"
              accessibilityLabel="Close profile"
              className={panel.close()}
            />

            {/* Avatar */}
            <View className={p.avatarWrap()}>
              <Avatar size="lg" color="accent" alt={getUserDisplayName() || 'User avatar'}>
                <Avatar.Fallback>
                  {initials || <MaterialIcons name="person" size={28} />}
                </Avatar.Fallback>
              </Avatar>
            </View>

            {/* User info */}
            <Dialog.Title className={p.title()}>Profile</Dialog.Title>
            <Text className={p.username()}>{getUserDisplayName()}</Text>
            {user?.email && <Text className={p.email()}>{user.email}</Text>}

            {/* Stats section */}
            <View className={p.statsRow()}>
              <View className={p.statCol()}>
                {statsLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text className={p.statValue()}>{detections}</Text>
                )}
                <Text className={p.statLabel()}>Detections</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                <Text className={p.statValue()}>{nfts.length}</Text>
                <Text className={p.statLabel()}>NFTs</Text>
              </View>
              <View className={p.statDivider()} />
              <View className={p.statCol()}>
                {statsLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text className={p.statValue()}>{daysActive}</Text>
                )}
                <Text className={p.statLabel()}>Days Active</Text>
              </View>
            </View>

            {/* Sign out button */}
            <Button
              variant="ghost"
              feedbackVariant="none"
              className={cn(tactileButton({ variant: 'default' }), 'w-full mb-2.5')}
              onPress={handleSignOut}
              isDisabled={isSigningOut}
              accessibilityLabel="Sign out"
              accessibilityHint="Sign out of your account"
            >
              <MaterialIcons name="logout" size={18} color={onSurface} />
              <Button.Label className={tactileButtonText({ variant: 'default' })}>
                Sign Out
              </Button.Label>
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      {signOutDialog}
    </>
  )
}
