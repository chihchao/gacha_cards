
import React from 'react';
import { CardData, SeriesType } from '../types';
import { SERIES_CONFIGS } from '../constants';

interface CardProps {
  card: CardData;
  onFlip: (id: number) => void;
  isFlipped: boolean;
}

// 定義一組亮麗可愛的馬卡龍色系
const CUTE_COLORS = [
  '#FFADAD', // 柔粉紅
  '#FFD6A5', // 粉橘
  '#FDFFB6', // 嫩黃
  '#CAFFBF', // 嫩綠
  '#9BF6FF', // 天藍
  '#A0C4FF', // 淺藍
  '#BDB2FF', // 薰衣草紫
  '#FFC6FF', // 亮粉
  '#FFCFD2', // 蜜桃
];

const Card: React.FC<CardProps> = ({ card, onFlip, isFlipped }) => {
  const config = SERIES_CONFIGS[card.series];
  
  // 使用 constants 中定義的圖案網址
  const frontImage = config.imageUrl;

  // 根據 ID 分配背景色，確保每次洗牌後視覺豐富
  const bgColor = CUTE_COLORS[card.id % CUTE_COLORS.length];

  // 計算 3x3 網格的位置 (共 9 格)
  // 索引 0-8
  const gridIndex = card.id % 9;
  const col = gridIndex % 3;
  const row = Math.floor(gridIndex / 3);
  
  // 背景位置百分比：0%, 50%, 100% 分別對應 3 格的起始點
  const posX = col * 50; 
  const posY = row * 50;

  return (
    <div 
      className="relative w-full h-full perspective-1000 cursor-pointer group"
      onClick={() => onFlip(card.id)}
    >
      <div 
        className={`relative w-full h-full duration-500 transition-transform preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* 正面 (未翻牌) - 隨機馬卡龍背景色 */}
        <div 
          className="absolute inset-0 backface-hidden rounded-lg shadow-md border-2 border-white/50 overflow-hidden p-1.5 transition-colors duration-300"
          style={{ backgroundColor: bgColor }}
        >
            {/* 使用 background-image 實現 3x3 網格切割 */}
            <div 
                className="w-full h-full rounded-md overflow-hidden bg-white/20 shadow-inner"
                style={{
                    backgroundImage: `url(${frontImage})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${posX}% ${posY}%`,
                    backgroundRepeat: 'no-repeat'
                }}
            >
            </div>
            {/* 懸停光澤與放大效果 */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
        </div>

        {/* 背面 (已翻牌) - 白色背景，深色文字 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center p-2 border-2 border-indigo-600 overflow-hidden">
           <div className="relative z-10 flex flex-col items-center w-full px-1">
             <div className="bg-indigo-50/80 px-3 py-4 rounded-2xl border border-indigo-100 backdrop-blur-sm w-full transform translate-z-10 shadow-sm">
               <div className="text-center font-black text-xl sm:text-2xl md:text-3xl text-indigo-900 leading-tight break-words">
                 {card.prize.name}
               </div>
             </div>
           </div>
           
           {/* 底部裝飾條 (依據系列顏色區分) */}
           <div className={`absolute bottom-0 inset-x-0 h-1.5 ${config.color}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
