import { Text, View, ScrollView, Image } from 'react-native';
import { vaultStyles as styles } from '../styles';

// Placeholder NFT data
const PLACEHOLDER_NFTS = [
  { id: '1', name: 'NFT #1' },
  { id: '2', name: 'NFT #2' },
  { id: '3', name: 'NFT #3' },
  { id: '4', name: 'NFT #4' },
  { id: '5', name: 'NFT #5' },
  { id: '6', name: 'NFT #6' },
];

export default function Vault() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vault</Text>
      <Text style={styles.description}>
        Your NFT Collection
      </Text>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {PLACEHOLDER_NFTS.map((nft) => (
            <View key={nft.id} style={styles.nftCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/150' }}
                  style={styles.nftImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.nftName}>{nft.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
