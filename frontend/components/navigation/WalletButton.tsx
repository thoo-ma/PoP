import { MaterialIcons } from '@expo/vector-icons'
import { Button } from 'heroui-native'
import { memo } from 'react'
import { useCSSVariable } from 'uniwind'
import { floatingNavButton } from '@/styles'

interface WalletButtonProps {
  onPress: () => void
}

export default memo(function WalletButton({ onPress }: WalletButtonProps) {
  const primary = useCSSVariable('--color-primary') as string
  return (
    <Button
      isIconOnly
      variant="ghost"
      feedbackVariant="none"
      onPress={onPress}
      className={floatingNavButton({ side: 'right' })}
      accessibilityLabel="Wallet"
      accessibilityHint="Opens your wallet and POOP balance"
    >
      <MaterialIcons name="account-balance-wallet" size={32} color={primary} />
    </Button>
  )
})
