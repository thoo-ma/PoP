import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { poopStyles as styles } from '../styles';
import { useUserNFTs, useUpdateNFT } from '../hooks';
import NFTProperties from '../components/NFTProperties';
import { ScreenLoader, ScreenError } from '../components';
import { nftEvents } from '../utils';

export default function Poop() {
  const { nfts, loading, error, refetch } = useUserNFTs();
  const { updateEnergy } = useUpdateNFT();
  const [actionLoading, setActionLoading] = useState(false);
  
  // Get the first NFT from vault with energy > 0 (or first available)
  const displayNFT = nfts.find(nft => nft.energy > 0) || nfts[0];
  
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
    
    setActionLoading(true);
    
    // Simulate gameplay - decrease energy by 10
    const newEnergy = Math.max(0, displayNFT.energy - 10);
    const success = await updateEnergy(displayNFT.id, newEnergy);
    
    setActionLoading(false);
    
    if (success) {
      await refetch(); // Refresh NFT list to show updated energy
      nftEvents.emit(); // Notify other screens
      Alert.alert(
        'Success!',
        `You earned rewards! Energy: ${displayNFT.energy} → ${newEnergy}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error',
        'Failed to update NFT energy. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  if (loading) {
    return <ScreenLoader title="Poop" message="Loading your collection..." />;
  }

  if (error || !displayNFT) {
    return (
      <ScreenError
        title="Poop"
        message={error ? `Error: ${error}` : 'No NFTs in your vault'}
        onRetry={error ? refetch : undefined}
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
        <View style={styles.nftCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: displayNFT.image }}
              style={styles.nftImage}
              resizeMode="cover"
            />
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv {displayNFT.level}</Text>
            </View>
            <View style={[styles.tierBadge, styles[`${displayNFT.tier}Badge`]]}>
              <Text style={styles.tierBadgeText}>{displayNFT.tier.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.nftInfo}>
            <Text style={styles.nftName}>{displayNFT.name}</Text>
            <NFTProperties
              efficiency={displayNFT.efficiency}
              resilience={displayNFT.resilience}
              comfort={displayNFT.comfort}
              luck={displayNFT.luck}
              energy={displayNFT.energy}
              mode="detailed"
            />
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.poopButton, (actionLoading || displayNFT.energy <= 0) && styles.poopButtonDisabled]} 
        onPress={handlePoop}
        disabled={actionLoading || displayNFT.energy <= 0}
        activeOpacity={0.8}
        accessibilityLabel="Start pooping"
        accessibilityRole="button"
        accessibilityHint="Begin your toilet session"
      >
        <Text style={styles.poopButtonText}>
          {actionLoading ? 'Processing...' : displayNFT.energy <= 0 ? 'No Energy' : 'Poop'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
