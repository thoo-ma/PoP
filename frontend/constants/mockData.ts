// Shared mock NFT data across the app

export interface MockNFT {
  id: string;
  name: string;
  image: string | number;
  efficiency: number;    // 0-100: Mining/earning efficiency
  resilience: number;    // 0-100: Durability (can be repaired)
  comfort: number;       // 0-100: User comfort bonus
  luck: number;          // 0-100: Chance of bonus rewards
  isListed?: boolean;
  price?: string;
}

const pooImage = require('../assets/poo.jpeg');

export const MOCK_NFTS: MockNFT[] = [
  { 
    id: '1', 
    name: 'NFT #1', 
    image: pooImage,
    efficiency: 78,
    resilience: 85,
    comfort: 82,
    luck: 70,
    isListed: true,
    price: '0.9 ETH'
  },
  { 
    id: '2', 
    name: 'NFT #2', 
    image: pooImage,
    efficiency: 88,
    resilience: 92,
    comfort: 85,
    luck: 90,
    isListed: true,
    price: '1.1 ETH'
  },
  { 
    id: '3', 
    name: 'NFT #3', 
    image: pooImage,
    efficiency: 75,
    resilience: 78,
    comfort: 80,
    luck: 65,
    isListed: false,
  },
  { 
    id: '4', 
    name: 'NFT #4', 
    image: pooImage,
    efficiency: 95,
    resilience: 100,
    comfort: 92,
    luck: 88,
    isListed: false,
  },
  { 
    id: '5', 
    name: 'NFT #5', 
    image: pooImage,
    efficiency: 60,
    resilience: 65,
    comfort: 70,
    luck: 75,
    isListed: false,
  },
  { 
    id: '6', 
    name: 'NFT #6', 
    image: pooImage,
    efficiency: 85,
    resilience: 88,
    comfort: 88,
    luck: 82,
    isListed: false,
  },
];

// Mock marketplace listings from other users
export const MOCK_MARKETPLACE_LISTINGS: MockNFT[] = [
  { id: '101', name: 'NFT #101', price: '0.5 ETH', image: pooImage, efficiency: 70, resilience: 80, comfort: 75, luck: 68 },
  { id: '102', name: 'NFT #102', price: '1.2 ETH', image: pooImage, efficiency: 90, resilience: 95, comfort: 88, luck: 92 },
  { id: '103', name: 'NFT #103', price: '0.8 ETH', image: pooImage, efficiency: 72, resilience: 75, comfort: 78, luck: 70 },
  { id: '104', name: 'NFT #104', price: '2.0 ETH', image: pooImage, efficiency: 98, resilience: 100, comfort: 95, luck: 96 },
  { id: '105', name: 'NFT #105', price: '0.3 ETH', image: pooImage, efficiency: 55, resilience: 60, comfort: 65, luck: 58 },
  { id: '106', name: 'NFT #106', price: '1.5 ETH', image: pooImage, efficiency: 88, resilience: 90, comfort: 85, luck: 87 },
];
