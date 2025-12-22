
import { SeriesType, Prize, SeriesConfig, RewardType, RewardCard, Student } from './types';

// 預設的視覺樣式查找表
export const REWARD_STYLES: Record<string, Partial<RewardCard>> = {
  '音樂卡': { color: '#A855F7', icon: '🎵', bgClass: 'bg-purple-100 text-purple-600' },
  '2x卡': { color: '#3B82F6', icon: '⭐ 2X', bgClass: 'bg-blue-100 text-blue-600' },
  '3x卡': { color: '#10B981', icon: '☘️ 3X', bgClass: 'bg-green-100 text-green-600' },
  '5x卡': { color: '#F59E0B', icon: '🏆 5X', bgClass: 'bg-yellow-100 text-yellow-600' },
  '午餐卡': { color: '#EF4444', icon: '🍱', bgClass: 'bg-red-100 text-red-600' },
  '免值卡': { color: '#64748b', icon: '🛡️', bgClass: 'bg-slate-100 text-slate-600' },
  '造型卡': { color: '#ec4899', icon: '✨', bgClass: 'bg-pink-100 text-pink-600' },
};

// 獲取獎勵的視覺定義（若無預設則自動生成）
export const getRewardDefinition = (name: string): RewardCard => {
  const style = REWARD_STYLES[name] || {
    color: '#6366f1',
    icon: '🎁',
    bgClass: 'bg-indigo-100 text-indigo-600'
  };
  return {
    type: name,
    name: name,
    color: style.color!,
    icon: style.icon!,
    bgClass: style.bgClass!,
  };
};

// 預設學生資料改為空
export const INITIAL_STUDENTS: Student[] = [];

const COMMON_CARD_FACE_URL = 'https://images.unsplash.com/vector-1764918071966-0dab7cad5f52?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const SERIES_CONFIGS: Record<SeriesType, SeriesConfig> = {
  [SeriesType.POKEMON]: { name: SeriesType.POKEMON, color: 'bg-yellow-400', imageUrl: COMMON_CARD_FACE_URL },
  [SeriesType.CHIIKAWA]: { name: SeriesType.CHIIKAWA, color: 'bg-sky-400', imageUrl: COMMON_CARD_FACE_URL },
  [SeriesType.SANRIO]: { name: SeriesType.SANRIO, color: 'bg-pink-400', imageUrl: COMMON_CARD_FACE_URL },
  [SeriesType.CAPYBARA]: { name: SeriesType.CAPYBARA, color: 'bg-orange-400', imageUrl: COMMON_CARD_FACE_URL },
};
