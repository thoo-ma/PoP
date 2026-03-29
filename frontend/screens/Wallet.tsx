import { Text, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Dialog, ScrollShadow } from "heroui-native";
import { useWallet } from "@/hooks";
import { dialogPanel } from "@/styles";
import { colors } from "@/constants";

interface WalletProps {
  /** Controls the visibility of the wallet modal. */
  visible: boolean;
  /** Called when the user dismisses the wallet modal. */
  onClose: () => void;
}

/**
 * Wallet modal screen showing the user's current POOP balance and a
 * brief explanation of how to earn and spend the currency.
 */
export default function Wallet({ visible, onClose }: WalletProps) {
  const { poopBalance, loading } = useWallet();
  const panel = dialogPanel();

  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
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
          <Text className="text-4xl mb-2">💩</Text>
          <Dialog.Title className="text-3xl font-bold text-foreground mb-4">Wallet</Dialog.Title>

          {/* Balance */}
          <View className="w-full bg-default rounded-xl px-4 py-4 items-center mb-4">
            <Text className="text-sm text-muted mb-1">POOP Balance</Text>
            {loading ? (
              <Text className="text-3xl font-bold text-foreground">—</Text>
            ) : (
              <Text className="text-3xl font-bold text-foreground">
                {poopBalance ?? 0} <Text className="text-lg text-muted font-medium">POOP</Text>
              </Text>
            )}
          </View>

          <ScrollShadow LinearGradientComponent={LinearGradient} className="w-full">
            <ScrollView contentContainerClassName="pb-2" showsVerticalScrollIndicator={false}>
              {/* How to earn */}
              <View className="mb-4">
                <Text className="text-base font-bold text-foreground mb-2">Earn POOP</Text>
                <View className="flex-row items-start gap-2">
                  <MaterialIcons name="check-circle" size={18} color={colors.success} />
                  <Text className="flex-1 text-sm text-muted leading-5">
                    <Text className="font-bold text-foreground">Variable POOP</Text> per successful
                    flush (scales with type, rarity &amp; level)
                  </Text>
                </View>
              </View>

              {/* How to spend */}
              <View>
                <Text className="text-base font-bold text-foreground mb-2">Spend POOP</Text>
                <View className="flex-row items-start gap-2 mb-2">
                  <MaterialIcons name="build" size={18} color={colors.comfort} />
                  <Text className="flex-1 text-sm text-muted leading-5">
                    <Text className="font-bold text-foreground">Variable POOP</Text> per repair
                    (scales with level &amp; rarity)
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <MaterialIcons name="device-hub" size={18} color={colors.luck} />
                  <Text className="flex-1 text-sm text-muted leading-5">
                    <Text className="font-bold text-foreground">Variable POOP</Text> per breed
                    (scales with rarity &amp; breed count)
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ScrollShadow>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
