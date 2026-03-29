import { memo } from "react";
import { View, Image } from "react-native";
import { Button, Dialog, cn } from "heroui-native";
import type { NFT } from "@/types/nft";
import { rarityBadge } from "@/styles";
import { formatDisplayName } from "@/utils";

interface MysteryBoxRevealModalProps {
  visible: boolean;
  /** The newly minted toilet NFT — must be non-null when `visible` is true. */
  nft: NFT | null;
  onClose: () => void;
}

/**
 * Celebrate the result of opening a mystery box.
 * Displays the newly minted toilet's image, name and rarity,
 * then lets the user dismiss to return to the vault.
 */
export default memo(function MysteryBoxRevealModal({
  visible,
  nft,
  onClose,
}: MysteryBoxRevealModalProps) {
  if (!nft) return null;

  return (
    <Dialog
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="mx-6 rounded-3xl px-6 pt-6 pb-8 items-center">
          <Dialog.Title className="text-xl font-extrabold text-foreground mb-1 text-center">
            You got a toilet! 🚽
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted mb-5 text-center">
            Your mystery box has been opened
          </Dialog.Description>

          <View className="w-[70%] aspect-square rounded-xl overflow-hidden bg-default mb-4 relative">
            <Image source={{ uri: nft.image_url }} className="w-full h-full" resizeMode="cover" />
            <View
              className={cn(
                "absolute bottom-2 right-2 px-2.5 py-1 rounded-md",
                rarityBadge({ rarity: nft.rarity }),
              )}
            >
              <Dialog.Description className="text-white text-xs font-bold tracking-wide">
                {nft.rarity.toUpperCase()}
              </Dialog.Description>
            </View>
          </View>

          <Dialog.Title className="text-base font-bold text-foreground mb-1 text-center">
            {formatDisplayName(nft.name)}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted mb-5 text-center capitalize">
            {nft.type.replace(/-/g, " ")}
          </Dialog.Description>

          <Button
            variant="primary"
            className="w-full"
            onPress={onClose}
            accessibilityLabel="Close reveal and return to vault"
          >
            <Button.Label>View in Vault</Button.Label>
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
});
