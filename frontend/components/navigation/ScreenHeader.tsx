import { memo } from 'react';
import { Text, View } from 'react-native';
import { screenTitle } from '@/styles';

const PAGE_TITLES = ['Poop', 'Vault', 'Breed', 'Marketplace', 'Repair'] as const;

interface ScreenHeaderProps {
  currentPage: number;
}

export default memo(function ScreenHeader({ currentPage }: ScreenHeaderProps) {
  const title = PAGE_TITLES[currentPage] ?? '';

  return (
    <View className="absolute top-[60px] left-0 right-0 z-[99] items-center justify-center pointer-events-none">
      <Text className={screenTitle({ spacing: 'sm', color: 'accent' })}>{title}</Text>
    </View>
  );
});
