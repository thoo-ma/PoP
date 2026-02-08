import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useEffect } from 'react';
import { poopStyles as styles } from '../styles';
import { useNFTStore } from '../hooks/useNFTStore';
import NFTProperties from '../components/NFTProperties';

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
          <View style={styles.imageContainer}>
            <Image
              source={typeof displayNFT.image === 'string' ? { uri: displayNFT.image } : displayNFT.image}
              style={styles.nftImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.nftInfo}>
            <Text style={styles.nftName}>{displayNFT.name}</Text>
            <NFTProperties
              efficiency={displayNFT.efficiency}
              resilience={displayNFT.resilience}
              comfort={displayNFT.comfort}
              luck={displayNFT.luck}
              mode="detailed"
            />
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
