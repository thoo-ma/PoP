import { useState } from 'react';
import { MOCK_NFTS, MockNFT } from '../constants/mockData';

let nftState = [...MOCK_NFTS];
let listeners: Array<() => void> = [];

export const useNFTStore = () => {
  const [, forceUpdate] = useState({});

  const subscribe = () => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const notify = () => {
    listeners.forEach(listener => listener());
  };

  const getNFTs = () => nftState;

  const listNFT = (nftId: string, price: string) => {
    nftState = nftState.map(nft =>
      nft.id === nftId ? { ...nft, isListed: true, price } : nft
    );
    notify();
  };

  const unlistNFT = (nftId: string) => {
    nftState = nftState.map(nft =>
      nft.id === nftId ? { ...nft, isListed: false } : nft
    );
    notify();
  };

  const updateNFTResilience = (nftId: string, newResilience: number) => {
    nftState = nftState.map(nft =>
      nft.id === nftId ? { ...nft, resilience: Math.min(100, Math.max(0, newResilience)) } : nft
    );
    notify();
  };

  return {
    nfts: getNFTs(),
    listNFT,
    unlistNFT,
    updateNFTResilience,
    subscribe,
  };
};
