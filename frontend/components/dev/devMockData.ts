import type { MysteryBox, NFTRarity } from '@pop/shared'
import { BREED_MAX_COUNT } from '@pop/shared'
import type { NFT } from '@/types'

const IMG = (color: string, label: string) =>
  `https://placehold.co/400x400/${color}/white?text=${encodeURIComponent(label)}`

// ── Mock NFTs ────────────────────────────────────────────────────────────────

export const MOCK_NFT_READY: NFT = {
  id: 'dev-nft-ready',
  name: 'toilet_mock_ready',
  image_url: IMG('8B5CF6', 'Ready'),
  rarity: 'rare',
  type: 'turbo-flush',
  level: 5,
  xp: 120,
  efficiency: 72,
  resilience: 68,
  comfort: 55,
  luck: 43,
  energy: 80,
  breed_count: 1,
  stat_points: 0,
  isListed: false,
  created_at: '2026-01-01T00:00:00Z',
  last_used_at: null,
  updated_at: '2026-01-01T00:00:00Z',
}

export const MOCK_NFT_FULL_ENERGY: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-full',
  name: 'toilet_mock_full',
  image_url: IMG('22C55E', 'Full'),
  energy: 100,
}

export const MOCK_NFT_NO_ENERGY: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-empty',
  name: 'toilet_mock_empty',
  image_url: IMG('EF4444', 'Empty'),
  energy: 0,
}

export const MOCK_NFT_COOLDOWN: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-cooldown',
  name: 'toilet_mock_cooldown',
  image_url: IMG('F59E0B', 'Cooldown'),
  last_used_at: new Date().toISOString(),
}

export const MOCK_NFT_MAXBREED: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-maxbreed',
  name: 'toilet_mock_maxbreed',
  image_url: IMG('EC4899', 'MaxBreed'),
  breed_count: BREED_MAX_COUNT,
}

export const MOCK_NFT_WITH_POINTS: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-points',
  name: 'toilet_mock_points',
  image_url: IMG('3B82F6', 'Points'),
  stat_points: 5,
}

export const MOCK_NFT_LISTED: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-listed',
  name: 'toilet_mock_listed',
  image_url: IMG('A855F7', 'Listed'),
  isListed: true,
  price: '0.5 ETH',
}

export const MOCK_NFT_COMMON: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-common',
  name: 'toilet_mock_common',
  image_url: IMG('9CA3AF', 'Common'),
  rarity: 'common',
  efficiency: 50,
  resilience: 45,
  comfort: 40,
  luck: 35,
}

export const MOCK_NFT_LEGENDARY: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-legendary',
  name: 'toilet_mock_legendary',
  image_url: IMG('F59E0B', 'Legendary'),
  rarity: 'legendary',
  efficiency: 85,
  resilience: 82,
  comfort: 78,
  luck: 75,
}

export const MOCK_NFT_TRANSCENDENT: NFT = {
  ...MOCK_NFT_READY,
  id: 'dev-nft-transcendent',
  name: 'toilet_mock_transcendent',
  image_url: IMG('EC4899', 'Transcend'),
  rarity: 'transcendent',
  efficiency: 95,
  resilience: 92,
  comfort: 88,
  luck: 85,
}

// ── Mock Mystery Box ─────────────────────────────────────────────────────────

export const mockMysteryBox = (rarity: NFTRarity, _count: number): MysteryBox => ({
  id: `dev-box-${rarity}`,
  rarity,
  image_url: IMG(
    rarity === 'common'
      ? '9CA3AF'
      : rarity === 'rare'
        ? '8B5CF6'
        : rarity === 'legendary'
          ? 'F59E0B'
          : 'EC4899',
    `${rarity}\nBox`,
  ),
  opened: false,
  created_at: '2026-01-01T00:00:00Z',
})

// Convenience: box data for MysteryBoxCard previews
export const MOCK_BOXES = {
  rareWithCount: { box: mockMysteryBox('rare', 3), count: 3 },
  legendaryWithCount: { box: mockMysteryBox('legendary', 1), count: 1 },
  commonEmpty: { box: null as MysteryBox | null, count: 0, rarity: 'common' as NFTRarity },
  transcendentEmpty: {
    box: null as MysteryBox | null,
    count: 0,
    rarity: 'transcendent' as NFTRarity,
  },
}
