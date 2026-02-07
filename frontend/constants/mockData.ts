// Shared mock NFT data across the app

export interface MockNFT {
  id: string;
  name: string;
  image: string;
  health?: number;
  isListed?: boolean;
  price?: string;
}

export const MOCK_NFTS: MockNFT[] = [
  { 
    id: '1', 
    name: 'NFT #1', 
    image: 'https://via.placeholder.com/150/FF6B6B',
    health: 85,
    isListed: true,
    price: '0.9 ETH'
  },
  { 
    id: '2', 
    name: 'NFT #2', 
    image: 'https://via.placeholder.com/150/4ECDC4',
    health: 92,
    isListed: true,
    price: '1.1 ETH'
  },
  { 
    id: '3', 
    name: 'NFT #3', 
    image: 'https://via.placeholder.com/150/45B7D1',
    health: 78,
    isListed: false,
  },
  { 
    id: '4', 
    name: 'NFT #4', 
    image: 'https://via.placeholder.com/150/96CEB4',
    health: 100,
    isListed: false,
  },
  { 
    id: '5', 
    name: 'NFT #5', 
    image: 'https://via.placeholder.com/150/FFEAA7',
    health: 65,
    isListed: false,
  },
  { 
    id: '6', 
    name: 'NFT #6', 
    image: 'https://via.placeholder.com/150/DFE6E9',
    health: 88,
    isListed: false,
  },
];

// Mock marketplace listings from other users
export const MOCK_MARKETPLACE_LISTINGS: MockNFT[] = [
  { id: '101', name: 'NFT #101', price: '0.5 ETH', image: 'https://via.placeholder.com/150/FF6B6B' },
  { id: '102', name: 'NFT #102', price: '1.2 ETH', image: 'https://via.placeholder.com/150/4ECDC4' },
  { id: '103', name: 'NFT #103', price: '0.8 ETH', image: 'https://via.placeholder.com/150/45B7D1' },
  { id: '104', name: 'NFT #104', price: '2.0 ETH', image: 'https://via.placeholder.com/150/96CEB4' },
  { id: '105', name: 'NFT #105', price: '0.3 ETH', image: 'https://via.placeholder.com/150/FFEAA7' },
  { id: '106', name: 'NFT #106', price: '1.5 ETH', image: 'https://via.placeholder.com/150/DFE6E9' },
];
