import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { cn, Dialog, ScrollShadow } from 'heroui-native'
import { ScrollView, Text, View } from 'react-native'
import { colors } from '@/constants'
import { useWallet } from '@/hooks'
import { dialogPanel, walletModal } from '@/styles'

interface WalletProps {
  /** Controls the visibility of the wallet modal. */
  visible: boolean
  /** Called when the user dismisses the wallet modal. */
  onClose: () => void
}

/**
 * Wallet modal screen showing the user's current POOP balance and a
 * brief explanation of how to earn and spend the currency.
 */
export default function Wallet({ visible, onClose }: WalletProps) {
  const { poopBalance, loading } = useWallet()
  const panel = dialogPanel()
  const w = walletModal()

  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay isCloseOnPress />
        <Dialog.Content className={panel.content()}>
          {/* Close button */}
          <Dialog.Close
            variant="ghost"
            accessibilityLabel="Close wallet"
            className={panel.close()}
          />

          {/* Header */}
          <Text className={w.emoji()}>💩</Text>
          <Dialog.Title className={w.title()}>Wallet</Dialog.Title>

          {/* Balance */}
          <View className={w.balanceCard()}>
            <Text className={w.balanceLabel()}>POOP Balance</Text>
            {loading ? (
              <Text className={w.balanceValue()}>—</Text>
            ) : (
              <Text className={w.balanceValue()}>
                {poopBalance ?? 0} <Text className={w.currencyLabel()}>POOP</Text>
              </Text>
            )}
          </View>

          <ScrollShadow LinearGradientComponent={LinearGradient} className="w-full">
            <ScrollView contentContainerClassName="pb-2" showsVerticalScrollIndicator={false}>
              {/* How to earn */}
              <View className={w.infoSection()}>
                <Text className={w.infoSectionTitle()}>Earn POOP</Text>
                <View className={w.infoRow()}>
                  <MaterialIcons name="check-circle" size={18} color={colors.success} />
                  <Text className={w.infoText()}>
                    <Text className={w.inlineBold()}>Variable POOP</Text> per successful flush
                    (scales with type, rarity &amp; level)
                  </Text>
                </View>
              </View>

              {/* How to spend */}
              <View>
                <Text className={w.infoSectionTitle()}>Spend POOP</Text>
                <View className={cn(w.infoRow(), 'mb-2')}>
                  <MaterialIcons name="build" size={18} color={colors.comfort} />
                  <Text className={w.infoText()}>
                    <Text className={w.inlineBold()}>Variable POOP</Text> per repair (scales with
                    level &amp; rarity)
                  </Text>
                </View>
                <View className={w.infoRow()}>
                  <MaterialIcons name="device-hub" size={18} color={colors.luck} />
                  <Text className={w.infoText()}>
                    <Text className={w.inlineBold()}>Variable POOP</Text> per breed (scales with
                    rarity &amp; breed count)
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ScrollShadow>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
