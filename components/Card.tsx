
import React from 'react';
import { CardData } from '../types';

interface CardProps {
  card: CardData;
  onFlip: (id: number) => void;
  isFlipped: boolean;
}

const GEM_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#F97316', // Orange
  '#14B8A6', // Teal
];

// 更新：更換為新的神奇寶貝 Sprite 素材 (10欄 x 3列)
const SPRITE_URL = 'https://chihchao.github.io/gacha_cards/docs/pokemon.jpg';

const Card: React.FC<CardProps> = ({ card, onFlip, isFlipped }) => {
  const baseColor = GEM_COLORS[card.id % GEM_COLORS.length];
  
  // 使用卡片數據中已存儲的隨機索引
  const spriteIndex = card.spriteIndex;

  // 計算背景定位百分比 (10欄：0%-100%，3列：0%-100%)
  const posX = (spriteIndex % 10) * (100 / 9);
  const posY = Math.floor(spriteIndex / 10) * (100 / 2);

  return (
    <div 
      className="relative w-full h-full perspective-1000 cursor-pointer group"
      onClick={() => onFlip(card.id)}
    >
      <div 
        className={`relative w-full h-full duration-700 transition-transform preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* 正面 (未翻牌) */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl shadow-lg border-4 border-white/80 overflow-hidden p-2 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1"
          style={{ backgroundColor: baseColor }}
        >
            <div className="w-full h-full rounded-xl bg-black/5 backdrop-blur-[1px] flex items-center justify-center p-1 relative overflow-hidden ring-1 ring-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                
                <div 
                  className="w-full h-full bg-no-repeat relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] transform group-hover:scale-105 transition-transform duration-500 ease-out" 
                  style={{
                    backgroundImage: `url(${SPRITE_URL})`,
                    backgroundSize: '1000% 300%', 
                    backgroundPosition: `${posX}% ${posY}%`,
                  }}
                />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </div>

        {/* 背面 (已翻牌) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-3 border-4 border-indigo-600 overflow-hidden">
           <div className="w-full h-full bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center border-2 border-indigo-100 p-2 relative">
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                 <div className="w-24 h-24 rounded-full border-[10px] border-indigo-900"></div>
               </div>
               
               <div className="text-center font-black text-xl sm:text-2xl text-indigo-950 leading-tight break-words drop-shadow-sm z-10">
                 {card.prize.name}
               </div>
               <div className="mt-3 w-10 h-1.5 bg-indigo-200 rounded-full"></div>
           </div>
           
           <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
           <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
           <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
           <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
