
import { SeriesType, Prize, SeriesConfig } from './types';

const COMMON_CARD_FACE_URL = 'https://images.unsplash.com/vector-1764918071966-0dab7cad5f52?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const SERIES_CONFIGS: Record<SeriesType, SeriesConfig> = {
  [SeriesType.POKEMON]: {
    name: SeriesType.POKEMON,
    color: 'bg-yellow-400',
    imageUrl: COMMON_CARD_FACE_URL,
  },
  [SeriesType.CHIIKAWA]: {
    name: SeriesType.CHIIKAWA,
    color: 'bg-sky-400',
    imageUrl: COMMON_CARD_FACE_URL,
  },
  [SeriesType.SANRIO]: {
    name: SeriesType.SANRIO,
    color: 'bg-pink-400',
    imageUrl: COMMON_CARD_FACE_URL,
  },
  [SeriesType.CAPYBARA]: {
    name: SeriesType.CAPYBARA,
    color: 'bg-orange-400',
    imageUrl: COMMON_CARD_FACE_URL,
  },
};

export const PRIZE_POOL: Prize[] = [
  // Multipliers (11)
  ...Array(5).fill({ name: '2倍卡', category: 'multiplier' }),
  ...Array(3).fill({ name: '3倍卡', category: 'multiplier' }),
  ...Array(2).fill({ name: '4倍卡', category: 'multiplier' }),
  ...Array(1).fill({ name: '5倍卡', category: 'multiplier' }),
  // Functions (10)
  ...Array(3).fill({ name: '音樂卡', category: 'function' }),
  ...Array(2).fill({ name: '通關卡', category: 'function' }),
  ...Array(3).fill({ name: '午餐卡', category: 'function' }),
  ...Array(2).fill({ name: '先吃卡', category: 'function' }),
  // Special (9)
  ...Array(2).fill({ name: '籤王卡', category: 'special' }),
  ...Array(2).fill({ name: '免值卡', category: 'special' }),
  ...Array(2).fill({ name: '免罰卡', category: 'special' }),
  ...Array(3).fill({ name: '造型卡', category: 'special' }),
].map((p, idx) => ({ ...p, id: `prize-${idx}` }));
