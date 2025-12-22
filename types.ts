
export enum SeriesType {
  POKEMON = 'Pokemon',
  CHIIKAWA = 'Chiikawa',
  SANRIO = 'Sanrio',
  CAPYBARA = 'Capybara'
}

// 動態獎勵類型改為 string
export type RewardType = string;

export interface RewardCard {
  type: RewardType;
  name: string;
  color: string;
  icon: string;
  bgClass: string;
}

export interface Student {
  id: string | number; 
  seat: string;
  name: string;
  avatar: string;
  inventory: Record<string, number>; 
}

export interface Prize {
  id: string;
  name: string;
  category: 'multiplier' | 'function' | 'special' | 'dynamic';
}

export interface CardData {
  id: number;
  series: SeriesType;
  prize: Prize;
  isFlipped: boolean;
  spriteIndex: number; // 用於固定每張卡片在該次卡池中的隨機圖案
}

export interface SeriesConfig {
  name: SeriesType;
  color: string;
  imageUrl: string;
}
