import { memo } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '@/constants'
import { Button } from 'heroui-native'

interface WalletButtonProps {
  onPress: () => void
}

export default memo(function WalletButton({ onPress }: WalletButtonProps) {
  return (
    <Button
      isIconOnly
      variant="ghost"
      onPress={onPress}
      className="absolute top-[60px] right-5 z-[100] p-2 bg-[rgba(255,255,255,0.9)] rounded-[20px] shadow-md"
      accessibilityLabel="Wallet"
      accessibilityHint="Opens your wallet and POOP balance"
    >
      <MaterialIcons name="account-balance-wallet" size={32} color={colors.primary} />
    </Button>
  )
})
