// Shared mock NFT data across the app
import type { NFT } from '../types/nft';

const chillImage1 = require('../assets/toilets/chill/chill-1.jpeg');
const chillImage2 = require('../assets/toilets/chill/chill-2.jpeg');
const chillImage3 = require('../assets/toilets/chill/chill-3.jpeg');
const chillImage4 = require('../assets/toilets/chill/chill-4.jpeg');
const chillImage5 = require('../assets/toilets/chill/chill-5.jpeg');
const chillImage6 = require('../assets/toilets/chill/chill-6.jpeg');
const nitroImage1 = require('../assets/toilets/nitro/nitro-1.jpeg');
const nitroImage2 = require('../assets/toilets/nitro/nitro-2.jpeg');
const nitroImage3 = require('../assets/toilets/nitro/nitro-3.jpeg');
const nitroImage4 = require('../assets/toilets/nitro/nitro-4.jpeg');
const nitroImage5 = require('../assets/toilets/nitro/nitro-5.jpeg');
const omegaImage1 = require('../assets/toilets/omega/omega-1.jpeg');
const omegaImage2 = require('../assets/toilets/omega/omega-2.jpeg');
const omegaImage3 = require('../assets/toilets/omega/omega-3.jpeg');
const omegaImage4 = require('../assets/toilets/omega/omega-4.jpeg');
const omegaImage5 = require('../assets/toilets/omega/omega-5.jpeg');

export const MOCK_NFTS: NFT[] = [
  { 
    id: '1', 
    name: 'NFT #1', 
    image: nitroImage1,
    efficiency: 78,
    resilience: 85,
    comfort: 82,
    luck: 70,
    energy: 65,
    level: 5,
    isListed: true,
    price: '0.9 ETH'
  },
  { 
    id: '2', 
    name: 'NFT #2', 
    image: omegaImage1,
    efficiency: 88,
    resilience: 92,
    comfort: 85,
    luck: 90,
    energy: 95,
    level: 12,
    isListed: true,
    price: '1.1 ETH'
  },
  { 
    id: '3', 
    name: 'NFT #3', 
    image: nitroImage2,
    efficiency: 75,
    resilience: 78,
    comfort: 80,
    luck: 65,
    energy: 45,
    level: 3,
    isListed: false,
  },
  { 
    id: '4', 
    name: 'NFT #4', 
    image: omegaImage2,
    efficiency: 95,
    resilience: 100,
    comfort: 92,
    luck: 88,
    energy: 100,
    level: 20,
    isListed: false,
  },
  { 
    id: '5', 
    name: 'NFT #5', 
    image: chillImage1,
    efficiency: 60,
    resilience: 65,
    comfort: 70,
    luck: 75,
    energy: 30,
    level: 1,
    isListed: false,
  },
  { 
    id: '6', 
    name: 'NFT #6', 
    image: omegaImage3,
    efficiency: 85,
    resilience: 88,
    comfort: 88,
    luck: 82,
    energy: 75,
    level: 8,
    isListed: false,
  },
];

// Mock marketplace listings from other users
export const MOCK_MARKETPLACE_LISTINGS: NFT[] = [
  { id: '101', name: 'NFT #101', price: '0.5 ETH', image: chillImage2, efficiency: 70, resilience: 80, comfort: 75, luck: 68, energy: 60, level: 4 },
  { id: '102', name: 'NFT #102', price: '1.2 ETH', image: omegaImage4, efficiency: 90, resilience: 95, comfort: 88, luck: 92, energy: 85, level: 15 },
  { id: '103', name: 'NFT #103', price: '0.8 ETH', image: nitroImage3, efficiency: 72, resilience: 75, comfort: 78, luck: 70, energy: 55, level: 6 },
  { id: '104', name: 'NFT #104', price: '2.0 ETH', image: omegaImage5, efficiency: 98, resilience: 100, comfort: 95, luck: 96, energy: 90, level: 18 },
  { id: '105', name: 'NFT #105', price: '0.3 ETH', image: chillImage3, efficiency: 55, resilience: 60, comfort: 65, luck: 58, energy: 40, level: 2 },
  { id: '106', name: 'NFT #106', price: '1.5 ETH', image: nitroImage4, efficiency: 88, resilience: 90, comfort: 85, luck: 87, energy: 80, level: 10 },
];
