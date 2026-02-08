import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useEffect } from 'react';
import { poopStyles as styles } from '../styles';
import { useNFTStore } from '../hooks/useNFTStore';

export default function Poop() {
  const { nfts, subscribe } = useNFTStore();
  
  useEffect(() => {
    return subscribe();
  }, []);
  
  // Get the first NFT from vault (or a random one)
  const displayNFT = nfts[0];
  
  const handlePoop = () => {
    Alert.alert(
      'Coming Soon',
      'This feature is not yet available.',
      [{ text: 'OK' }]
    );
  };
  
  if (!displayNFT) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Poop</Text>
        <Text style={styles.emptyText}>No NFTs in your vault</Text>
      </View>
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
          <Image
            source={{ uri: displayNFT.image }}
            style={styles.nftImage}
            resizeMode="cover"
          />
          <View style={styles.nftInfo}>
            <Text style={styles.nftName}>{displayNFT.name}</Text>
            {displayNFT.health !== undefined && (
              <View style={styles.healthInfo}>
                <Text style={styles.healthLabel}>Health:</Text>
                <View style={styles.healthBarContainer}>
                  <View 
                    style={[
                      styles.healthBar, 
                      { width: `${displayNFT.health}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.healthValue}>{displayNFT.health}%</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.poopButton} 
        onPress={handlePoop}
        activeOpacity={0.8}
      >
        <Text style={styles.poopButtonText}>Poop</Text>
      </TouchableOpacity>
    </View>
  );
}
