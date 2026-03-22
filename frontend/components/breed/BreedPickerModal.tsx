import { View, Text, Image, FlatList } from 'react-native';
import { Button, Dialog } from 'heroui-native';
import type { NFT } from '@/types';
import type { NFTRarity } from '@shared';
import { RARITY_COLORS } from '@/constants';
import { canBreed, formatDisplayName } from '@/utils';

export interface BreedPickerModalProps {
  /** Controls modal visibility. */
  visible: boolean;
  /** Title displayed at the top of the sheet (e.g. "Choose Parent 1"). */
  title: string;
  /** Full NFT collection to show as selectable items. */
  allNFTs: NFT[];
  /** ID of the NFT already chosen in the other slot — rendered as disabled. */
  lockedId?: string;
  /** Rarity of the other slot's NFT — items incompatible with it are disabled. */
  lockedRarity?: NFTRarity;
  /** Called with the chosen NFT when the user taps a valid row. */
  onSelect: (nft: NFT) => void;
  /** Called when the user dismisses the sheet without selecting. */
  onClose: () => void;
}

/**
 * Bottom-sheet modal for picking an NFT to place in a breed parent slot.
 * Items that conflict with `lockedId` or are incompatible with `lockedRarity`
 * are shown greyed-out and non-interactive.
 */
export default function BreedPickerModal({
  visible, title, allNFTs, lockedId, lockedRarity, onSelect, onClose,
}: BreedPickerModalProps) {
  const items = allNFTs.map((nft) => ({
    nft,
    disabled:
      nft.id === lockedId ||
      (lockedRarity !== undefined && !canBreed(lockedRarity, nft.rarity)),
  }));

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="rounded-t-3xl pt-1 max-h-[85%]">
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-border">
            <Dialog.Title className="text-lg font-bold text-foreground">{title}</Dialog.Title>
            <Dialog.Close variant="ghost" />
          </View>
          {lockedRarity && (
            <Text className="text-sm text-muted px-5 pt-2.5 pb-1 leading-[18px]">
              Greyed-out NFTs are incompatible with your first selection.
            </Text>
          )}
          <FlatList
            data={items}
            keyExtractor={(item) => item.nft.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            contentContainerClassName="p-4 pb-10"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Button
                variant="ghost"
                className={`flex-1 p-0 overflow-hidden rounded-xl border border-border bg-surface${item.disabled ? ' opacity-40' : ''}`}
                onPress={() => { if (!item.disabled) { onSelect(item.nft); onClose(); } }}
                isDisabled={item.disabled}
              >
                <View>
                  <Image source={{ uri: item.nft.image_url }} className="w-full aspect-square" resizeMode="cover" />
                  {item.disabled && (
                    <View className="absolute inset-0 bg-white/50" />
                  )}
                  <View
                    className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-[1.5px] border-surface"
                    style={{ backgroundColor: RARITY_COLORS[item.nft.rarity] }}
                  />
                  <View className="px-2 pt-1.5">
                    <Text
                      className={`text-sm font-semibold${item.disabled ? ' text-muted' : ' text-foreground'}`}
                      numberOfLines={1}
                    >
                      {formatDisplayName(item.nft.name)}
                    </Text>
                    <Text
                      className="text-[11px] font-medium capitalize pb-2"
                      style={{ color: RARITY_COLORS[item.nft.rarity] }}
                    >
                      {item.nft.rarity}
                    </Text>
                  </View>
                </View>
              </Button>
            )}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
