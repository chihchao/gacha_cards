
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

const Card: React.FC<CardProps> = ({ card, onFlip, isFlipped }) => {
  // 根據 ID 分配基礎背景色，確保視覺多樣性
  const baseColor = GEM_COLORS[card.id % GEM_COLORS.length];
  
  // 將 spriteIndex (1-30) 格式化為二位數 (如 01, 02...)
  const paddedIndex = String(card.spriteIndex).padStart(2, '0');
  const imageUrl = `https://chihchao.github.io/html/gacha_cards/${paddedIndex}.png`;

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
        {/* 正面 (未翻牌)：神奇寶貝圖案 */}
        <div 
          className="absolute inset-0 backface-hidden rounded-2xl shadow-lg border-4 border-white/80 overflow-hidden p-2 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1"
          style={{ backgroundColor: baseColor }}
        >
            <div className="w-full h-full rounded-xl bg-white/10 backdrop-blur-[1px] flex items-center justify-center p-0.5 relative overflow-hidden ring-1 ring-white/30">
                {/* 裝飾性漸層 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                
                {/* 單張圖片展示：使用 bg-cover 適配比例 */}
                <div 
                  className="w-full h-full bg-no-repeat bg-cover bg-center relative z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] transform group-hover:scale-105 transition-transform duration-500 ease-out rounded-lg" 
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                  }}
                />
            </div>
            
            {/* 掃光特效 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
        </div>

        {/* 背面 (已翻牌)：獎勵內容 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-3 border-4 border-indigo-600 overflow-hidden">
           <div className="w-full h-full bg-indigo-50/50 rounded-xl flex flex-col items-center justify-center border-2 border-indigo-100 p-2 relative">
               {/* 浮水印背景 */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                 <div className="w-24 h-24 rounded-full border-[12px] border-indigo-900"></div>
               </div>
               
               <div className="text-center font-black text-lg sm:text-xl text-indigo-950 leading-tight break-words drop-shadow-sm z-10">
                 {card.prize.name}
               </div>
               <div className="mt-3 w-10 h-1.5 bg-indigo-200 rounded-full"></div>
           </div>
           
           {/* 精緻裝飾點 */}
           <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
           <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
           <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
           <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
