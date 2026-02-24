import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { poopStyles as styles } from '@/styles';
import { useUserNFTs, usePoopNFT } from '@/hooks';
import { ScreenLoader, ScreenError, NFTSelector, NFTProperties } from '@/components';
import { nftEvents, formatDisplayName, TYPE_BADGE_STYLES } from '@/utils';

export default function Poop() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { poopNFT, loading: actionLoading } = usePoopNFT();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPooped, setIsPooped] = useState(false);
  const [poopedEnergy, setPoopedEnergy] = useState<{ from: number; to: number } | null>(null);

  const displayNFT = selectedIndex !== null ? (nfts[selectedIndex] ?? null) : null;

  const handleSelectNFT = () => {
    if (nfts.length === 0) return;
    const idx = nfts.findIndex(nft => nft.energy > 0);
    setSelectedIndex(idx >= 0 ? idx : 0);
  };

  const handlePoop = async () => {
    if (!displayNFT) return;

    if (displayNFT.energy <= 0) {
      Alert.alert(
        'No Energy',
        'This NFT has no energy left. Visit the Repair screen to restore energy.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await poopNFT(displayNFT.id);

    if (result) {
      await refetch();
      nftEvents.emit();
      setPoopedEnergy({ from: displayNFT.energy, to: result.energy });
      setIsPooped(true);
    } else {
      Alert.alert(
        'Error',
        'Failed to use NFT. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setIsPooped(false);
    setPoopedEnergy(null);
  };
  
  if (loading) {
    return <ScreenLoader title="Poop" message="Loading your collection..." />;
  }

  if (error) {
    return (
      <ScreenError
        title="Poop"
        message={`Error: ${error}`}
        onRetry={refetch}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Poop</Text>
      <Text style={styles.description}>
        Use your NFT to generate rewards
      </Text>
      
      <View style={styles.nftContainer}>
        {selectedIndex === null ? (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectNFT}
            disabled={nfts.length === 0}
          >
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.selectText}>
              {nfts.length === 0 ? 'No NFTs Available' : 'Select NFT from Vault'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <NFTSelector
              current={selectedIndex + 1}
              total={nfts.length}
              onPrev={() => {
                setSelectedIndex(i => ((i as number) - 1 + nfts.length) % nfts.length);
                setIsPooped(false);
                setPoopedEnergy(null);
              }}
              onNext={() => {
                setSelectedIndex(i => ((i as number) + 1) % nfts.length);
                setIsPooped(false);
                setPoopedEnergy(null);
              }}
              style={{ marginBottom: 12 }}
            />
            {!isPooped && (
              <View style={styles.nftCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: displayNFT!.image }}
                    style={styles.nftImage}
                    resizeMode="cover"
                  />
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>Lv {displayNFT!.level}</Text>
                  </View>
                  <View style={[styles.tierBadge, TYPE_BADGE_STYLES[displayNFT!.type]]}>
                    <Text style={styles.tierBadgeText}>{displayNFT!.type.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.nftInfo}>
                  <Text style={styles.nftName}>{formatDisplayName(displayNFT!.name)}</Text>
                  <NFTProperties
                    efficiency={displayNFT!.efficiency}
                    resilience={displayNFT!.resilience}
                    comfort={displayNFT!.comfort}
                    luck={displayNFT!.luck}
                    energy={displayNFT!.energy}
                    mode="detailed"
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {selectedIndex !== null && (
        <>
          {isPooped ? (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>✓ Poop Complete!</Text>
              {poopedEnergy && (
                <Text style={styles.successDetail}>
                  Energy: {poopedEnergy.from} → {poopedEnergy.to}
                </Text>
              )}
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>Poop Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.poopButton, (actionLoading || displayNFT!.energy <= 0) && styles.poopButtonDisabled]}
              onPress={handlePoop}
              disabled={actionLoading || displayNFT!.energy <= 0}
              activeOpacity={0.8}
              accessibilityLabel="Start pooping"
              accessibilityRole="button"
              accessibilityHint="Begin your toilet session"
            >
              <Text style={styles.poopButtonText}>
                {actionLoading ? 'Processing...' : displayNFT!.energy <= 0 ? 'No Energy' : 'Poop'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
