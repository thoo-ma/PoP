import { memo } from 'react';
import { Image, View } from 'react-native';
import type { ReactNode } from 'react';
import { Card, Chip } from 'heroui-native';
import type { MysteryBox } from '@shared';
import { RARITY_COLORS } from '@/constants';

interface MysteryBoxCardProps {
  box: MysteryBox;
  /** Number of boxes of this rarity. When > 1, a count badge is shown. */
  count?: number;
  /** Slot for the action area below the card header (e.g. an Open button). */
  action?: ReactNode;
}

export default memo(function MysteryBoxCard({ box, count, action }: MysteryBoxCardProps) {
  return (
    <Card className="w-full mb-4" animation="disable-all">
      <View className="w-full aspect-square relative">
        <Image
          source={{ uri: box.image_url }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Rarity — bottom-right */}
        <Chip
          size="sm"
          variant="primary"
          style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: RARITY_COLORS[box.rarity] }}
          animation="disable-all"
        >
          <Chip.Label className="text-white text-xs font-bold">{box.rarity.toUpperCase()}</Chip.Label>
        </Chip>

        {/* Count — top-left */}
        {count !== undefined && count > 0 && (
          <Chip
            size="sm"
            variant="secondary"
            className="absolute top-2 left-2"
            animation="disable-all"
          >
            <Chip.Label className="text-white text-sm font-bold">×{count}</Chip.Label>
          </Chip>
        )}

        {/* Opened — top-right */}
        {box.opened && (
          <Chip
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2"
            animation="disable-all"
          >
            <Chip.Label className="text-white text-xs font-semibold">Opened</Chip.Label>
          </Chip>
        )}
      </View>

      <Card.Body className="p-2 gap-2">
        <Card.Title className="text-sm font-bold">Mystery Box</Card.Title>
        <Chip size="sm" variant="primary" animation="disable-all">
          <Chip.Label className="text-white text-xs font-bold tracking-wide">MYSTERY BOX</Chip.Label>
        </Chip>
        {action}
      </Card.Body>
    </Card>
  );
});
